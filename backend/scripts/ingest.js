/**
 * Ingestion script: chunk all chapter Markdown files → embed → upsert into Qdrant.
 *
 * Run once (or whenever content changes):
 *   node scripts/ingest.js
 *
 * Strategy:
 *   - Split on Markdown headings and blank-line boundaries
 *   - Target chunk size ~400 tokens (≈ 1600 chars), 75-token overlap (≈ 300 chars)
 *   - Embed with HuggingFace all-MiniLM-L6-v2 (batches of 32)
 *   - Upsert into Qdrant with payload: { chapterId, section, text, level }
 */
import 'dotenv/config';
import { readFile, readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

import { initQdrant, upsertPoints } from '../src/services/qdrant.js';
import { embedBatch } from '../src/services/embeddings.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, '../../content/chapters');
const LEVELS = ['beginner', 'intermediate', 'advanced'];
const CHUNK_SIZE = 1600;   // chars ≈ 400 tokens
const OVERLAP = 300;       // chars ≈ 75 tokens
const BATCH_SIZE = 32;

// ---------- helpers ---------------------------------------------------------

function chunkText(text, size = CHUNK_SIZE, overlap = OVERLAP) {
  const paragraphs = text.split(/\n{2,}/);
  const chunks = [];
  let current = '';

  for (const para of paragraphs) {
    if ((current + '\n\n' + para).length > size && current) {
      chunks.push(current.trim());
      // Keep the tail of `current` as overlap seed
      current = current.slice(-overlap) + '\n\n' + para;
    } else {
      current = current ? current + '\n\n' + para : para;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

/** Extract a heading label from markdown text, fallback to 'General'. */
function extractSection(text) {
  const match = text.match(/^#{1,3}\s+(.+)/m);
  return match ? match[1].trim() : 'General';
}

/** Deterministic UUID from chapter + section + chunk index. */
function makeId(chapterId, level, index) {
  const hex = createHash('sha1').update(`${chapterId}|${level}|${index}`).digest('hex');
  // Format as UUID: 8-4-4-4-12
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20,32)}`;
}

// ---------- main ------------------------------------------------------------

await initQdrant();

const dirs = (await readdir(CONTENT_DIR)).sort();
let totalChunks = 0;

for (const chapterId of dirs) {
  for (const level of LEVELS) {
    let raw;
    try {
      raw = await readFile(join(CONTENT_DIR, chapterId, `${level}.md`), 'utf8');
    } catch {
      continue; // skip missing variants
    }

    const chunks = chunkText(raw.replace(/\r\n/g, '\n'));
    console.log(`  ${chapterId}/${level}: ${chunks.length} chunks`);

    // Embed in batches
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);
      const vectors = await embedBatch(batch);

      const points = batch.map((text, j) => ({
        id: makeId(chapterId, level, i + j),
        vector: vectors[j],
        payload: {
          chapterId,
          section: extractSection(text),
          text,
          level,
        },
      }));

      await upsertPoints(points);
      totalChunks += batch.length;
    }
  }
}

console.log(`\nIngestion complete. ${totalChunks} chunks upserted.`);

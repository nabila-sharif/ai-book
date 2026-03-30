import { readFile, readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = process.env.CONTENT_DIR || join(__dirname, '../../content/chapters');

const VALID_LEVELS = ['beginner', 'intermediate', 'advanced'];

export async function listChapters() {
  const dirs = await readdir(CONTENT_DIR);
  const chapters = await Promise.all(
    dirs.map(async (dir) => {
      const metaPath = join(CONTENT_DIR, dir, 'meta.json');
      const raw = await readFile(metaPath, 'utf8');
      return JSON.parse(raw);
    })
  );
  return chapters.sort((a, b) => a.order - b.order);
}

export async function getChapter(id, level = 'intermediate') {
  const safeLevel = VALID_LEVELS.includes(level) ? level : 'intermediate';

  const metaPath = join(CONTENT_DIR, id, 'meta.json');
  let meta;
  try {
    meta = JSON.parse(await readFile(metaPath, 'utf8'));
  } catch {
    const err = new Error(`Chapter '${id}' not found`);
    err.status = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  // Fall back to intermediate if requested level variant doesn't exist yet
  let content;
  for (const fallback of [safeLevel, 'intermediate']) {
    try {
      content = await readFile(join(CONTENT_DIR, id, `${fallback}.md`), 'utf8');
      break;
    } catch { /* try next */ }
  }

  if (!content) {
    const err = new Error(`Content for chapter '${id}' not found`);
    err.status = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  return { ...meta, content, level: safeLevel };
}

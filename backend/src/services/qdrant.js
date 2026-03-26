import { QdrantClient } from '@qdrant/js-client-rest';

const COLLECTION = process.env.QDRANT_COLLECTION || 'textbook_chunks';
const SCORE_THRESHOLD = 0.55;
const TOP_K = 5;

let client;
function getClient() {
  if (!client) {
    client = new QdrantClient({
      url: process.env.QDRANT_URL || 'http://localhost:6333',
      apiKey: process.env.QDRANT_API_KEY,
    });
  }
  return client;
}

/**
 * Initialise Qdrant collection if it does not exist.
 * Vector size: 384 (all-MiniLM-L6-v2), distance: Cosine.
 */
export async function initQdrant() {
  const qdrant = getClient();
  const { collections } = await qdrant.getCollections();
  const exists = collections.some((c) => c.name === COLLECTION);

  if (!exists) {
    await qdrant.createCollection(COLLECTION, {
      vectors: { size: 384, distance: 'Cosine' },
    });
    console.log(`Qdrant: created collection "${COLLECTION}"`);
  } else {
    console.log(`Qdrant: collection "${COLLECTION}" ready`);
  }
}

/**
 * Search for the top-K closest chunks above the score threshold.
 * @param {number[]} vector  384-dim query embedding
 * @param {number}   topK    max results (default 5)
 * @returns {Promise<Array<{chapterId: string, section: string, text: string, score: number}>>}
 */
export async function searchChunks(vector, topK = TOP_K) {
  const qdrant = getClient();
  const results = await qdrant.search(COLLECTION, {
    vector,
    limit: topK,
    score_threshold: SCORE_THRESHOLD,
    with_payload: true,
  });

  return results.map((r) => ({
    chapterId: r.payload.chapterId,
    section: r.payload.section,
    text: r.payload.text,
    score: r.score,
  }));
}

/**
 * Upsert a batch of points into the collection.
 * @param {Array<{id: string|number, vector: number[], payload: object}>} points
 */
export async function upsertPoints(points) {
  const qdrant = getClient();
  await qdrant.upsert(COLLECTION, { wait: true, points });
}

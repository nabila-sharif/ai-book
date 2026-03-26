import { HfInference } from '@huggingface/inference';

const MODEL = 'sentence-transformers/all-MiniLM-L6-v2';

let hf;
function getClient() {
  if (!hf) hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  return hf;
}

/**
 * Embed a single string → 384-dim float array.
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export async function embedText(text) {
  const result = await getClient().featureExtraction({
    model: MODEL,
    inputs: text,
  });
  // result may be nested array [[...]] for single input
  return Array.isArray(result[0]) ? result[0] : result;
}

/**
 * Embed multiple strings in one request → array of 384-dim vectors.
 * @param {string[]} texts
 * @returns {Promise<number[][]>}
 */
export async function embedBatch(texts) {
  const result = await getClient().featureExtraction({
    model: MODEL,
    inputs: texts,
  });
  return result;
}

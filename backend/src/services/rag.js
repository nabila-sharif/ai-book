import { embedText } from './embeddings.js';
import { searchChunks } from './qdrant.js';
import { streamChatResponse } from './claude.js';

/**
 * Orchestrate the full RAG pipeline:
 *   1. Embed the question
 *   2. Retrieve relevant chunks from Qdrant
 *   3. Stream a grounded answer via Claude Haiku
 *
 * If no chunks meet the relevance threshold the model will emit
 * "Answer not found in textbook" through streamChatResponse.
 *
 * @param {string}                     question  User question
 * @param {import('express').Response} res       Express response (SSE already open)
 */
export async function answerQuestion(question, res) {
  const vector = await embedText(question);
  const chunks = await searchChunks(vector);
  await streamChatResponse(chunks, question, res);
}

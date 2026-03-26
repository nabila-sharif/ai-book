import { Router } from 'express';
import { answerQuestion } from '../services/rag.js';

const router = Router();

/**
 * POST /api/chat
 * Body: { question: string }
 * Streams SSE: delta | not_found | done | error
 */
router.post('/', async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string' || !question.trim()) {
    return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'question is required' } });
  }

  if (question.trim().length > 500) {
    return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'question too long (max 500 chars)' } });
  }

  // Open SSE stream
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    await answerQuestion(question.trim(), res);
  } catch (err) {
    console.error('Chat error:', err);
    res.write(`data: ${JSON.stringify({ type: 'error', text: 'Chat is temporarily unavailable.' })}\n\n`);
  } finally {
    res.end();
  }
});

export default router;

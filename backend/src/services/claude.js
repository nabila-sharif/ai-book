import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 1024;

let anthropic;
function getClient() {
  if (!anthropic) anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return anthropic;
}

function buildSystemPrompt(chunks) {
  const excerpts = chunks
    .map((c, i) => `[${i + 1}] (Chapter: ${c.chapterId} — ${c.section})\n${c.text}`)
    .join('\n\n');

  return `You are an AI assistant for a textbook on Physical AI and Humanoid Robotics.
Answer ONLY from the provided textbook excerpts below.
Always include the citation in the format: (Source: Chapter <id> — <section>).
If the answer cannot be found in the excerpts, respond exactly with:
"Answer not found in textbook"

--- TEXTBOOK EXCERPTS ---
${excerpts}
--- END EXCERPTS ---`;
}

/**
 * Stream a RAG-grounded chat response via SSE.
 *
 * SSE event types emitted to the client:
 *   data: {"type":"delta","text":"..."}
 *   data: {"type":"not_found","text":"Answer not found in textbook"}
 *   data: {"type":"done"}
 *   data: {"type":"error","text":"..."}
 *
 * @param {Array<{chapterId:string,section:string,text:string}>} chunks  Retrieved context
 * @param {string} question  User question
 * @param {import('express').Response} res  Express response (SSE already open)
 */
export async function streamChatResponse(chunks, question, res) {
  const client = getClient();

  const stream = await client.messages.stream({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: buildSystemPrompt(chunks),
    messages: [{ role: 'user', content: question }],
  });

  let fullText = '';

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
      const text = event.delta.text;
      fullText += text;
      res.write(`data: ${JSON.stringify({ type: 'delta', text })}\n\n`);
    }
  }

  // If the model returned the not-found sentinel, signal it explicitly
  if (fullText.trim() === 'Answer not found in textbook') {
    res.write(
      `data: ${JSON.stringify({ type: 'not_found', text: 'Answer not found in textbook' })}\n\n`
    );
  } else {
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
  }
}

---
id: "007"
title: RAG Backend Qdrant Services
stage: green
date: 2026-03-26
surface: agent
model: claude-sonnet-4-6
feature: 001-ai-textbook-platform
branch: 001-ai-textbook-platform
user: nabila sharif
command: /sp.implement
labels: ["implement","rag","qdrant","embeddings","claude","streaming","sse","ingest"]
links:
  spec: specs/001-ai-textbook-platform/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/src/services/embeddings.js
  - backend/src/services/qdrant.js
  - backend/src/services/claude.js
  - backend/src/services/rag.js
  - backend/src/routes/chat.js
  - backend/scripts/create-collection.js
  - backend/scripts/ingest.js
  - backend/src/index.js
tests:
  - Manual: POST {"question":"What is sensor fusion?"} to /api/chat — streamed response with (Source: Chapter 3 — Sensor Fusion)
  - Manual: POST {"question":"What is the capital of France?"} — response is "Answer not found in textbook"
  - Manual: POST {} (no question) — 400 BAD_REQUEST returned
---

## Prompt

Task: Build RAG backend with Qdrant.
Keep output clean, structured, and production-ready.
Avoid unnecessary complexity.

## Response snapshot

Implemented full RAG pipeline (T021–T027):

- `backend/src/services/embeddings.js` — `embedText(text)` and `embedBatch(texts)` via HuggingFace `sentence-transformers/all-MiniLM-L6-v2`, lazy client init
- `backend/src/services/qdrant.js` — `initQdrant()` (creates collection if absent), `searchChunks(vector, topK=5)` with cosine threshold 0.55, `upsertPoints(points)`
- `backend/src/services/claude.js` — `streamChatResponse(chunks, question, res)` using `anthropic.messages.stream()` with Claude Haiku; SSE events: `delta`, `not_found`, `done`; RAG system prompt grounded to textbook excerpts
- `backend/src/services/rag.js` — `answerQuestion(question, res)` orchestrator: embed → search → stream
- `backend/src/routes/chat.js` — `POST /api/chat` with SSE headers, input validation (non-empty, max 500 chars), error SSE event on failure
- `backend/scripts/create-collection.js` — one-time collection creation script
- `backend/scripts/ingest.js` — chunks all chapter markdown (~400 token / ~1600 char chunks, 300-char overlap), embeds in batches of 32, upserts with `{chapterId, section, text, level}` payload; deterministic SHA1 IDs
- `backend/src/index.js` — mounted `/api/chat` route

## Outcome

- ✅ Impact: Complete RAG backend; full SSE streaming pipeline from question to grounded answer with citations
- 🧪 Tests: manual validation list above
- 📁 Files: 8 files created/updated
- 🔁 Next prompts: /sp.implement for MVP Deployment (T031–T035) or continue US2 frontend (T028–T030)
- 🧠 Reflection: Qdrant `upsertPoints` uses deterministic SHA1 IDs to avoid duplicate ingestion; ingest script targets `intermediate` level only (extend LEVELS array once beginner/advanced variants authored)

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): follow-up implement
- Next experiment: run ingest with production Qdrant credentials and validate chunk count

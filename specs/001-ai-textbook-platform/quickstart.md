# Quickstart: AI-Native Textbook Platform

**Branch**: `001-ai-textbook-platform` | **Date**: 2026-03-26

---

## Prerequisites

- Node.js 20 LTS installed
- A free account on each service:
  - [Vercel](https://vercel.com) (frontend deployment)
  - [Railway](https://railway.app) (backend deployment)
  - [Qdrant Cloud](https://cloud.qdrant.io) (vector DB)
  - [Neon](https://neon.tech) (PostgreSQL)
  - [HuggingFace](https://huggingface.co) (embeddings API key)
  - [Anthropic](https://console.anthropic.com) (Claude Haiku API key)

---

## 1. Clone and Install

```bash
git clone <repo-url>
cd <repo>

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

---

## 2. Configure Environment Variables

```bash
# Copy the example env file
cp backend/.env.example backend/.env
```

Fill in `backend/.env`:

```env
PORT=3001
NODE_ENV=development

ANTHROPIC_API_KEY=sk-ant-...
HUGGINGFACE_API_KEY=hf_...

QDRANT_URL=https://<your-cluster>.cloud.qdrant.io
QDRANT_API_KEY=<your-qdrant-key>
QDRANT_COLLECTION=textbook_chunks

DATABASE_URL=postgresql://user:pass@<neon-host>/neondb?sslmode=require

BETTER_AUTH_SECRET=<random-32-char-string>
BETTER_AUTH_URL=http://localhost:3001

FRONTEND_URL=http://localhost:3000
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 3. Set Up Qdrant Collection

Create the collection once (run from `backend/`):

```bash
node scripts/create-collection.js
```

This creates a Qdrant collection `textbook_chunks` with:
- Vector size: 384
- Distance metric: Cosine

---

## 4. Run the Ingestion Script

This embeds all chapter content and upserts to Qdrant. Run once after any
content change:

```bash
cd backend
node scripts/ingest.js
```

Expected output:
```
Ingesting chapter: 01-intro-to-physical-ai (3 variants)...
  beginner.md → 8 chunks
  intermediate.md → 10 chunks
  advanced.md → 9 chunks
Ingesting chapter: 02-humanoid-anatomy (3 variants)...
...
✅ Ingestion complete. Total chunks: 243
```

---

## 5. Run the Database Migration

Better-Auth manages the schema. Run from `backend/`:

```bash
npx better-auth migrate
```

Then add the custom `level` column:

```bash
node scripts/migrate-level.js
```

---

## 6. Start Development Servers

```bash
# Terminal 1 — backend
cd backend && npm run dev
# Starts Express on http://localhost:3001

# Terminal 2 — frontend
cd frontend && npm start
# Starts Docusaurus on http://localhost:3000
```

Open `http://localhost:3000` to see the textbook.

---

## 7. Validate RAG Chatbot

With both servers running, test the chatbot:

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What is sensor fusion in humanoid robots?"}' \
  --no-buffer
```

Expected: a streamed response ending with a citation like
`(Source: Chapter 3 — Sensors and Perception)`.

Test the fallback:

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the capital of France?"}' \
  --no-buffer
```

Expected: `Answer not found in textbook`

---

## 8. Deploy to Production

### 8a. Deploy Backend to Railway

1. Push repo to GitHub.
2. In Railway: New Project → Deploy from GitHub repo → select `backend/` folder.
3. Add all environment variables from `backend/.env` to Railway's env vars UI.
4. Railway auto-detects Node.js and deploys. Note the generated domain.
5. Update `BETTER_AUTH_URL` and `FRONTEND_URL` with production URLs.

### 8b. Deploy Frontend to Vercel

1. In Vercel: New Project → Import GitHub repo → set root directory to `frontend/`.
2. Add `NEXT_PUBLIC_API_URL=https://<railway-domain>` as environment variable.
3. Vercel auto-deploys on every push to `main`.

### 8c. Verify Production Deployment

- Open Vercel domain → chapter list renders
- Open any chapter → content loads in < 2s
- Open chat widget → ask a question → streamed response with citation appears
- Ask an out-of-scope question → "Answer not found in textbook"

---

## 9. Validation Checklist (Phase 1 Complete)

Run through these manually before marking Phase 1 done:

- [ ] All 6–8 chapters visible on chapter list page
- [ ] Each chapter loads fully on mobile (375px width, Chrome DevTools)
- [ ] Chapter loads in < 2 seconds (Chrome Network tab, 4G throttle)
- [ ] RAG: 5 in-scope questions return answers with citations
- [ ] RAG: 5 out-of-scope questions return "Answer not found in textbook"
- [ ] Chat widget usable on mobile (no layout overflow)
- [ ] Backend logs show no API keys in output
- [ ] `backend/.env` is in `.gitignore` and NOT committed
- [ ] Qdrant collection has expected chunk count
- [ ] Neon database has `user` and `session` tables (even if empty at Phase 1)

---

## Troubleshooting

**"HuggingFace 503 during ingestion"**
→ HuggingFace free tier cold-starts. Retry after 30 seconds, or switch to local
embedding: `EMBEDDING_MODE=local node scripts/ingest.js`

**"Qdrant connection refused"**
→ Check `QDRANT_URL` includes `https://` and the API key is correct.

**"Better-Auth migration fails"**
→ Ensure `DATABASE_URL` uses `?sslmode=require` for Neon connections.

**"Railway deployment crashes"**
→ Check Railway logs for missing env vars. All vars in `.env.example` are required.

# Implementation Plan: AI-Native Textbook Platform

**Branch**: `001-ai-textbook-platform` | **Date**: 2026-03-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ai-textbook-platform/spec.md`

---

## Summary

Build a three-phase AI-native textbook platform for Physical AI & Humanoid Robotics.
Phase 1 delivers a Docusaurus-based textbook plus a RAG chatbot (Claude Haiku +
Qdrant), deployed on Vercel (frontend) and Railway (backend). Phase 2 adds
Better-Auth authentication and level-based personalization. Phase 3 adds Urdu
translation, chapter summaries, and quizzes.

All infrastructure runs on free tiers. The backend is a minimal Node.js/Express
API. The frontend is Docusaurus with custom React components for chat, level
selection, and translation.

---

## Technical Context

**Language/Version**: Node.js 20 LTS (backend + scripts), React 18 (via Docusaurus 3)
**Primary Dependencies**:
- Frontend: Docusaurus 3, React 18, custom plugin for chat/translate widgets
- Backend: Express 4, better-auth, @qdrant/js-client-rest, @anthropic-ai/sdk,
  @huggingface/inference, pg (Neon PostgreSQL driver)
- Scripts: Node.js ingestion script (one-time run)

**Storage**:
- Qdrant Cloud free tier — vector embeddings + chunk metadata
- Neon free tier (PostgreSQL) — users, sessions (Better-Auth tables)
- Client localStorage — cached Urdu translations

**Testing**: Vitest (unit), Supertest (API integration), manual spot-check (RAG accuracy)

**Target Platform**: Web — mobile-first (375px+), deployed to Vercel + Railway

**Project Type**: Web application (separate frontend + backend)

**Performance Goals**:
- Chapter page load: < 2s on 4G mobile
- RAG response: < 5s for 95th percentile
- Translation: < 3s streaming for ≤ 2000-word chapter
- Auth flows: < 10s end-to-end

**Constraints**:
- All infrastructure on free tiers at launch
- API keys server-side only (never exposed to frontend)
- No runtime AI calls for personalization (pre-authored content variants)
- Chunk size 300–500 tokens, overlap 50–100 tokens

**Scale/Scope**: Launch-scale (< 1000 users), single textbook (6–8 chapters),
3 content variants per chapter

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Check | Status |
|-----------|-------|--------|
| I. Simplicity & Speed First | Node.js + Docusaurus, no heavy deps, static content where possible | ✅ PASS |
| II. Content Authority (RAG Grounding) | RAG answers only from Qdrant chunks; cosine threshold 0.55; citation in every response; exact fallback string enforced | ✅ PASS |
| III. Phase-Gated Delivery | Plan structured as Phase 1 → 2 → 3; Phase 2/3 tasks blocked until Phase 1 deployed | ✅ PASS |
| IV. Learner-Centered Design | Docusaurus mobile-first; 6–8 chapters; reading time metadata per chapter; 3 pre-authored level variants | ✅ PASS |
| V. Translation Quality | Claude Haiku with strict prompt listing technical terms to preserve; streaming for speed; localStorage cache | ✅ PASS |
| VI. Security & Secrets | All keys in `.env`; `.env.example` documented; HTTP-only session cookies; passwords never logged | ✅ PASS |
| VII. Smallest Viable Change | Pre-authored variants (no runtime personalization AI); static quiz/summary JSON; no unneeded abstractions | ✅ PASS |

**Gate result**: ✅ All principles satisfied — proceed to Phase 0.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-ai-textbook-platform/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── openapi.yaml     # Phase 1 output
└── tasks.md             # /sp.tasks output (not created here)
```

### Source Code (repository root)

```text
frontend/                          # Docusaurus 3 textbook app
├── docs/                          # Chapter Markdown (served via API, not built-in)
├── src/
│   ├── components/
│   │   ├── ChatWidget/            # RAG chatbot UI (Phase 1)
│   │   │   ├── index.jsx
│   │   │   └── ChatWidget.module.css
│   │   ├── LevelSelector/         # Level picker (Phase 2)
│   │   │   └── index.jsx
│   │   └── TranslateButton/       # Urdu toggle (Phase 3)
│   │       └── index.jsx
│   ├── pages/
│   │   ├── index.jsx              # Landing / chapter list
│   │   └── chapter/[id].jsx       # Dynamic chapter page
│   └── css/
│       └── custom.css
├── static/
├── docusaurus.config.js
├── package.json
└── .env.local                     # NEXT_PUBLIC_API_URL (Vercel env)

backend/                           # Express API
├── src/
│   ├── routes/
│   │   ├── chapters.js            # GET /api/chapters, GET /api/chapters/:id
│   │   ├── chat.js                # POST /api/chat
│   │   ├── auth.js                # POST /api/auth/* (Better-Auth handler)
│   │   ├── user.js                # GET/PATCH /api/user/* (Phase 2)
│   │   └── translate.js           # POST /api/translate (Phase 3)
│   ├── services/
│   │   ├── rag.js                 # embed → retrieve → generate
│   │   ├── embeddings.js          # HuggingFace Inference API wrapper
│   │   ├── qdrant.js              # Qdrant client wrapper
│   │   ├── claude.js              # Anthropic SDK wrapper (chat + translate)
│   │   └── chapters.js            # Reads chapter Markdown from content/
│   ├── middleware/
│   │   └── requireAuth.js         # Session guard (Phase 2)
│   └── index.js                   # Express app + server
├── scripts/
│   └── ingest.js                  # One-time: chunk → embed → upsert to Qdrant
├── .env.example
├── package.json
└── Dockerfile                     # For Railway deployment

content/                           # Textbook source files (committed to repo)
├── chapters/
│   ├── 01-intro-to-physical-ai/
│   │   ├── meta.json              # { title, readingTime, order }
│   │   ├── beginner.md
│   │   ├── intermediate.md
│   │   └── advanced.md
│   ├── 02-humanoid-anatomy/
│   ├── 03-sensors-and-perception/
│   ├── 04-locomotion-and-control/
│   ├── 05-learning-in-robots/
│   ├── 06-real-world-applications/
│   └── ... (up to 8 chapters)
└── quizzes/                       # Phase 3 — static JSON
    ├── 01-intro.quiz.json
    └── ...

docs/
└── deployment.md                  # Vercel + Railway + Qdrant + Neon setup guide
```

**Structure Decision**: Web application (Option 2). Frontend and backend are
separate deployable units. `content/` is a shared source-of-truth directory
read by the backend at runtime — it is committed to the repo and served by the
backend, not embedded in the Docusaurus static build. This enables level-based
content switching without frontend rebuilds.

---

## Complexity Tracking

> No constitution violations found. Table left empty intentionally.

---

## Phase 0: Research & Decisions

*See [research.md](./research.md) for full findings.*

### Key Decisions Made

| Area | Decision | Rationale |
|------|----------|-----------|
| Embedding model | `sentence-transformers/all-MiniLM-L6-v2` via HuggingFace Inference API | Free tier, 384-dim vectors, good semantic quality for English text |
| Chunking strategy | Recursive sentence-aware splitter, 400 tokens target, 75 overlap | Balances context completeness with retrieval precision |
| RAG generation | Claude Haiku (`claude-haiku-4-5-20251001`) with streaming | Cheapest Claude model, fast, sufficient quality for citation-based QA |
| Cosine threshold | 0.55 | Empirically good balance: avoids irrelevant results, not overly strict |
| Top-K retrieval | 5 chunks | Fits within Claude Haiku context window comfortably; enough context |
| Translation model | Claude Haiku with strict system prompt | Same API key, no extra service, streaming for low latency |
| Auth library | Better-Auth (server-side sessions, Neon adapter) | Constitution-mandated; HTTP-only cookies; no JWT complexity |
| Session storage | Neon PostgreSQL (Better-Auth built-in adapter) | Free tier, co-located with user table |
| Frontend framework | Docusaurus 3 | Constitution-mandated; SSG for fast loading; good mobile defaults |
| Chapter serving | Backend API (`/api/chapters/:id?level=`) | Enables level switching without frontend rebuild |
| Backend runtime | Node.js 20 + Express 4 | Minimal, fast, native JSON, good ecosystem for all deps |
| Deployment: frontend | Vercel (free tier) | Auto-deploy from `frontend/`, CDN, free SSL |
| Deployment: backend | Railway (free tier, $5 credit) | Dockerfile deploy, persistent service, env vars UI |
| Vector DB | Qdrant Cloud free (1GB) | Constitution-mandated; generous free tier for launch scale |
| Relational DB | Neon free (PostgreSQL 0.5GB) | Constitution-mandated; serverless PG, free tier sufficient |

---

## Phase 1: Design & Contracts

*See [data-model.md](./data-model.md) and [contracts/openapi.yaml](./contracts/openapi.yaml).*

### Deployment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  GitHub (main branch)                                           │
│  Push to main → triggers:                                       │
│    - Vercel: builds frontend/ → deploys to CDN                 │
│    - Railway: rebuilds backend/ Docker image → rolling restart  │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┴───────────────┐
        ▼                              ▼
┌───────────────┐              ┌──────────────────┐
│ Vercel        │              │ Railway          │
│ (frontend/)   │              │ (backend/)       │
│               │─── HTTPS ───▶│                  │
│ docusaurus    │              │ Express API      │
│ static build  │              │ port 3001        │
│               │              │                  │
└───────────────┘              └──────┬───────────┘
                                      │
              ┌───────────────────────┼──────────────────────┐
              ▼                       ▼                      ▼
   ┌──────────────────┐   ┌───────────────────┐   ┌──────────────────┐
   │ Qdrant Cloud     │   │ Neon (PostgreSQL) │   │ Anthropic API    │
   │ (free 1GB)       │   │ (free 0.5GB)      │   │ Claude Haiku     │
   │ vectors+metadata │   │ users + sessions  │   │ (chat+translate) │
   └──────────────────┘   └───────────────────┘   └──────────────────┘
                                                            │
                                                   ┌────────▼──────────┐
                                                   │ HuggingFace       │
                                                   │ Inference API     │
                                                   │ (embeddings only) │
                                                   └───────────────────┘
```

### Environment Variables

**Backend (Railway env vars)**:

```env
# Server
PORT=3001
NODE_ENV=production

# Anthropic
ANTHROPIC_API_KEY=

# HuggingFace (embeddings)
HUGGINGFACE_API_KEY=

# Qdrant
QDRANT_URL=
QDRANT_API_KEY=
QDRANT_COLLECTION=textbook_chunks

# Neon (PostgreSQL)
DATABASE_URL=

# Better-Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=https://<your-railway-domain>

# CORS
FRONTEND_URL=https://<your-vercel-domain>
```

**Frontend (Vercel env vars)**:

```env
NEXT_PUBLIC_API_URL=https://<your-railway-domain>
```

---

## Phase Delivery Plan

### Phase 1 — MVP (Textbook + RAG Chatbot)

**Goal**: Deployed, readable textbook with working RAG chatbot.

**Milestone acceptance**:
- [ ] All 6–8 chapters readable on mobile
- [ ] RAG chatbot returns answers with citations
- [ ] "Answer not found in textbook" works for out-of-scope questions
- [ ] Deployed: Vercel + Railway + Qdrant + Neon

**Tasks** (see tasks.md):
1. Repo scaffold: `frontend/`, `backend/`, `content/`
2. Author 6–8 chapters (intermediate variant) + `meta.json` per chapter
3. Backend: Express app + `/api/chapters` routes
4. Backend: Ingestion script (chunk → embed → upsert to Qdrant)
5. Backend: RAG service (embed query → retrieve → Claude Haiku → stream)
6. Backend: `POST /api/chat` route
7. Frontend: Docusaurus setup + chapter list page
8. Frontend: Dynamic chapter page (fetches from backend)
9. Frontend: ChatWidget component
10. Deployment: Vercel + Railway + `.env` setup
11. Validation: spot-check 5 RAG queries per chapter

---

### Phase 2 — Auth + Personalization

**Goal**: Logged-in users select a learning level; content adapts.

**Milestone acceptance**:
- [ ] Signup, login, logout work
- [ ] Session persists 7 days
- [ ] Level selector visible to logged-in users
- [ ] Chapter content changes visibly between levels

**Prerequisite**: Phase 1 deployed and validated.

**Tasks** (see tasks.md):
1. Author beginner + advanced variants for all chapters
2. Neon: create users + sessions schema (Better-Auth migration)
3. Backend: integrate Better-Auth (`/api/auth/*` handler)
4. Backend: `/api/user/profile`, `/api/user/level` routes (auth-gated)
5. Frontend: Login / Signup pages
6. Frontend: LevelSelector component (profile page)
7. Frontend: Pass `?level=` param when fetching chapters
8. Frontend: Persist level in user session (via profile API)

---

### Phase 3 — Translation + Learning Tools

**Goal**: Urdu translation, chapter summaries, quizzes.

**Milestone acceptance**:
- [ ] "Translate to Urdu" button works on all chapters; technical terms in English
- [ ] Toggle back to English is instant (cached)
- [ ] Summary shows 3–5 key points per chapter
- [ ] Quiz shows 3–5 questions; results shown on submit

**Prerequisite**: Phase 2 deployed and validated.

**Tasks** (see tasks.md):
1. Backend: `POST /api/translate` route (Claude Haiku, streaming)
2. Frontend: TranslateButton component + localStorage cache
3. Generate static quiz JSON for all chapters (one-time script)
4. Generate static summary JSON for all chapters (one-time script)
5. Backend: `GET /api/chapters/:id/summary`, `GET /api/chapters/:id/quiz`
6. Backend: `POST /api/chapters/:id/quiz/submit`
7. Frontend: Summary panel component
8. Frontend: Quiz component with immediate result feedback

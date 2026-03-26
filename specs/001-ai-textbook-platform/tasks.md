# Tasks: AI-Native Textbook Platform

**Input**: Design documents from `/specs/001-ai-textbook-platform/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/openapi.yaml ✅

**Tests**: Not requested — no TDD tasks included.

**Organization**: Tasks grouped by user story for independent implementation and testing.
Each story phase is independently deployable and demonstrable.

---

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[Story]**: Which user story (US1–US6)
- All file paths are relative to repo root

---

## Phase 1: Setup

**Purpose**: Scaffold the monorepo and install all dependencies before any story work begins.

- [x] T001 Initialize repo directories: create `frontend/`, `backend/`, `content/chapters/`, `docs/` at repo root
- [x] T002 [P] Initialize backend Node.js project: `cd backend && npm init -y` then install `express cors dotenv @anthropic-ai/sdk @huggingface/inference @qdrant/js-client-rest pg better-auth`; create `backend/package.json` with `"type": "module"` and `"scripts": {"start": "node src/index.js", "dev": "node --watch src/index.js"}`
- [x] T003 [P] Initialize Docusaurus 3 frontend: run `npx create-docusaurus@latest frontend classic --typescript false` then install `react-markdown remark-gfm`; update `frontend/package.json` with `"proxy": "http://localhost:3001"`
- [x] T004 [P] Create `backend/.env.example` listing every required variable: `PORT`, `NODE_ENV`, `ANTHROPIC_API_KEY`, `HUGGINGFACE_API_KEY`, `QDRANT_URL`, `QDRANT_API_KEY`, `QDRANT_COLLECTION`, `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `FRONTEND_URL`
- [x] T005 [P] Add `.gitignore` at repo root covering: `node_modules/`, `*.env`, `.env.local`, `dist/`, `.docusaurus/`, `build/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core backend infrastructure required by both US1 and US2.
**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T006 Create `backend/src/index.js`: Express app with `cors` (origin from `FRONTEND_URL` env), `express.json()`, mount routes at `/api/chapters`, `/api/chat`; start server on `process.env.PORT || 3001`; log startup message with port
- [x] T007 Create `backend/Dockerfile`: use `node:20-alpine`, `WORKDIR /app`, copy `package*.json` and run `npm ci --omit=dev`, copy `src/` and `content/` (for runtime chapter reads), expose 3001, `CMD ["node", "src/index.js"]`
- [x] T008 Create `backend/src/services/chapters.js`: export `listChapters()` that reads all `content/chapters/*/meta.json` files sorted by `order`; export `getChapter(id, level)` that reads `content/chapters/{id}/{level}.md` and returns `{ ...meta, content, level }`; throw `404` error if file not found
- [x] T009 Create `content/chapters/` directory structure: create 6 subdirectories (`01-intro-to-physical-ai`, `02-humanoid-anatomy`, `03-sensors-and-perception`, `04-locomotion-and-control`, `05-learning-in-robots`, `06-real-world-applications`) each containing a stub `meta.json` with `{ id, title, order, readingTimeMinutes, description }`
- [x] T010 Configure `frontend/docusaurus.config.js`: set `title: "Physical AI & Humanoid Robotics"`, disable built-in docs plugin (`docs: false`), set `url` and `baseUrl` to `/`, add custom navbar with title link; remove default blog plugin

**Checkpoint**: Foundation ready — US1 and US2 can begin in parallel after this.

---

## Phase 3: User Story 1 — Read the Textbook (Priority: P1) 🎯 MVP

**Goal**: Learner can browse all chapters and read any chapter on mobile in under 2 seconds.

**Independent Test**: Open `http://localhost:3000`, see chapter list with 6 titles and reading times. Click any chapter — content renders fully. Resize to 375px — no horizontal scroll. Scroll to bottom — "Next Chapter" link visible.

### Implementation for User Story 1

- [x] T011 [P] [US1] Author `content/chapters/01-intro-to-physical-ai/intermediate.md`: 600–800 words covering what Physical AI is, how it differs from software-only AI, and why it matters; include `## What is Physical AI?`, `## Why Physical AI Now?`, `## Key Capabilities` sections
- [x] T012 [P] [US1] Author `content/chapters/02-humanoid-anatomy/intermediate.md`: 600–800 words on humanoid robot body structure — joints, actuators, degrees of freedom, power systems; include `## Body Structure`, `## Joints and Actuators`, `## Power and Control` sections
- [x] T013 [P] [US1] Author `content/chapters/03-sensors-and-perception/intermediate.md`: 600–800 words on LiDAR, cameras, IMU, proprioception, sensor fusion; include `## Sensing the World`, `## Types of Sensors`, `## Sensor Fusion` sections
- [x] T014 [P] [US1] Author `content/chapters/04-locomotion-and-control/intermediate.md`: 600–800 words on walking gaits, balance, trajectory planning, inverse kinematics; include `## Movement Basics`, `## Balance and Stability`, `## Planning Motion` sections
- [x] T015 [P] [US1] Author `content/chapters/05-learning-in-robots/intermediate.md`: 600–800 words on reinforcement learning, imitation learning, sim-to-real transfer; include `## How Robots Learn`, `## Reinforcement Learning`, `## Learning from Humans` sections
- [x] T016 [P] [US1] Author `content/chapters/06-real-world-applications/intermediate.md`: 600–800 words on warehouse robots, healthcare, disaster response, consumer robots; include `## Where Robots Work Today`, `## Near-Future Applications`, `## Challenges Remaining` sections
- [x] T017 [US1] Create `backend/src/routes/chapters.js`: `GET /` calls `chapters.listChapters()` and returns `{ chapters }`; `GET /:id` calls `chapters.getChapter(id, req.query.level || 'intermediate')` and returns chapter object; mount in `backend/src/index.js`
- [x] T018 [US1] Create `frontend/src/pages/index.jsx`: fetch `GET /api/chapters` on mount; render a card grid showing `title`, `readingTimeMinutes`, and `description` for each chapter; each card links to `/chapter/{id}`; show skeleton loader while fetching
- [x] T019 [US1] Create `frontend/src/pages/chapter/[id].jsx` (use Docusaurus `@docusaurus/plugin-content-pages` custom page): fetch `GET /api/chapters/:id` on mount; render Markdown via `react-markdown` with `remark-gfm`; show "Next Chapter" link at bottom based on chapter `order`; handle 404 gracefully
- [x] T020 [US1] Add mobile-first styles in `frontend/src/css/custom.css`: body font 16px minimum; chapter content max-width 720px centered; `a` tap targets min 44px; headings responsive sizing; card grid responsive (1 col mobile, 2 col tablet, 3 col desktop)

**Checkpoint**: User Story 1 complete — chapter list and reading experience fully functional and mobile-ready.

---

## Phase 4: User Story 2 — RAG Chatbot (Priority: P1)

**Goal**: Learner asks a question; chatbot answers from textbook content with citation, or returns "Answer not found in textbook".

**Independent Test**: POST `{"question": "What is sensor fusion?"}` to `/api/chat` — receive streamed response ending with `(Source: Chapter 3 — Sensor Fusion)`. POST `{"question": "What is the capital of France?"}` — receive `Answer not found in textbook`.

### Implementation for User Story 2

- [x] T021 [US2] Create `backend/src/services/embeddings.js`: export `embedText(text)` using `@huggingface/inference` with model `sentence-transformers/all-MiniLM-L6-v2`; return 384-dim float array; throw descriptive error if API key missing or request fails
- [x] T022 [US2] Create `backend/src/services/qdrant.js`: export `initQdrant()` that returns a configured `QdrantClient`; export `searchChunks(queryVector, topK=5)` that runs cosine search on collection `process.env.QDRANT_COLLECTION` and returns points with score ≥ 0.55; return empty array if none qualify
- [x] T023 [US2] Create `backend/scripts/create-collection.js`: use `QdrantClient` to create collection `textbook_chunks` with `{ size: 384, distance: "Cosine" }` if it does not already exist; print success/skip message; run with `node backend/scripts/create-collection.js`
- [x] T024 [US2] Create `backend/src/services/claude.js`: export `streamChatResponse(chunks, question, res)` that builds the RAG system prompt (from research.md §3), calls `anthropic.messages.stream()` with `claude-haiku-4-5-20251001`, and pipes SSE events `{"type":"delta","text":"..."}` and `{"type":"done"}` to Express `res`; if `chunks` is empty, write `{"type":"not_found","text":"Answer not found in textbook"}` and end
- [x] T025 [US2] Create `backend/src/services/rag.js`: export `answerQuestion(question, res)` that calls `embedText(question)`, then `searchChunks(vector)`, then `streamChatResponse(chunks, question, res)`; handle errors by writing `{"type":"error","text":"Chat is temporarily unavailable. Please try again."}` to SSE stream
- [x] T026 [US2] Create `backend/scripts/ingest.js`: for each chapter directory, read all three level variants; split text into chunks of ~400 tokens with 75-token overlap (sentence-aware: split on `. `, `! `, `? `); embed each chunk with `embedText()`; upsert to Qdrant with payload `{ chunk_text, chapter_id, chapter_title, section_heading, level, chunk_index, token_count }`; print progress per chapter; run with `node backend/scripts/ingest.js`
- [x] T027 [US2] Create `backend/src/routes/chat.js`: `POST /` validates `req.body.question` is non-empty string (return 400 if invalid); sets SSE headers (`Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`); calls `rag.answerQuestion(question, res)`; mount in `backend/src/index.js`
- [x] T028 [US2] Create `frontend/src/components/ChatWidget/index.jsx`: floating button (bottom-right, 56px circle) opens a panel (full-screen modal on mobile ≤ 768px, 400px side panel on desktop); panel has text input, submit button, and scrollable message list; on submit calls `POST /api/chat` via `fetch` with streaming (`ReadableStream`); renders delta text as it arrives; shows citation in gray italic; shows "Answer not found in textbook" in amber when applicable
- [x] T029 [US2] Create `frontend/src/components/ChatWidget/ChatWidget.module.css`: floating button fixed bottom-right; panel z-index 1000; input min height 44px; message bubbles max-width 85%; full-screen on mobile with `@media (max-width: 768px)`; smooth open/close transition (no animation on mobile for performance)
- [x] T030 [US2] Mount `ChatWidget` in `frontend/src/theme/Root.jsx` (Docusaurus theme swizzle) so it appears on every page including chapter pages

**Checkpoint**: User Story 2 complete — RAG chatbot answers from textbook with citations, returns fallback for unknown questions, works on mobile.

---

## Phase 5: MVP Deployment

**Purpose**: Deploy Phase 1 (US1 + US2) to production before starting Phase 2.

- [ ] T031 Run `node backend/scripts/create-collection.js` with production Qdrant credentials to create `textbook_chunks` collection; verify in Qdrant Cloud dashboard
- [ ] T032 Run `node backend/scripts/ingest.js` with production credentials; verify chunk count in Qdrant dashboard (expect 150–300 chunks for 6 intermediate chapters)
- [ ] T033 Deploy backend to Railway: create new project from GitHub repo, set root directory to `backend/`, add all env vars from `.env.example`, wait for healthy deploy, note production URL
- [ ] T034 Deploy frontend to Vercel: create new project from GitHub repo, set root directory to `frontend/`, set `NEXT_PUBLIC_API_URL` to Railway production URL, wait for deploy, verify chapter list loads
- [ ] T035 Validate Phase 1 MVP: manually test 5 in-scope RAG questions (verify citations), 3 out-of-scope questions (verify fallback text), chapter load time on Chrome DevTools 4G throttle (≤ 2s), ChatWidget on 375px viewport; document results in `docs/deployment.md`

---

## Phase 6: User Story 3 — Sign Up and Log In (Priority: P2)

**Goal**: Learners create accounts and log in; session persists 7 days.

**Independent Test**: `POST /api/auth/signup` with `{email, password}` → 201 + session cookie. `POST /api/auth/login` with same credentials → 200 + session cookie. `GET /api/user/profile` with cookie → 200 + user object. `POST /api/auth/logout` → 204 + cookie cleared.

**Prerequisite**: Phase 1 (T001–T035) deployed and validated.

### Implementation for User Story 3

- [ ] T036 [US3] Run Better-Auth database migration on Neon: install `better-auth` in backend, run `npx better-auth migrate` with `DATABASE_URL` pointing to Neon; verify `user` and `session` tables exist in Neon console
- [ ] T037 [US3] Create `backend/scripts/migrate-level.js`: run SQL `ALTER TABLE "user" ADD COLUMN IF NOT EXISTS level VARCHAR(20) NOT NULL DEFAULT 'intermediate'` against Neon via `pg` client; run once with `node backend/scripts/migrate-level.js`
- [ ] T038 [US3] Create `backend/src/routes/auth.js`: mount Better-Auth handler using `auth.handler` on `POST /signup`, `POST /login`, `POST /logout`; configure Better-Auth with Neon pg adapter, `secret: process.env.BETTER_AUTH_SECRET`, `trustedOrigins: [process.env.FRONTEND_URL]`; mount in `backend/src/index.js` at `/api/auth`
- [ ] T039 [US3] Create `backend/src/middleware/requireAuth.js`: export middleware that calls `auth.api.getSession({ headers: req.headers })`; if no session, return 401 `{ error: { code: "UNAUTHORIZED", message: "Not authenticated" } }`; attach `req.user` and `req.session` for downstream routes
- [ ] T040 [US3] Create `frontend/src/pages/signup.jsx`: form with email + password fields (min 8 chars); on submit POST to `/api/auth/signup`; on success redirect to `/`; on 409 show "An account with this email already exists"; validate inputs client-side before submit
- [ ] T041 [US3] Create `frontend/src/pages/login.jsx`: form with email + password; on submit POST to `/api/auth/login`; on success redirect to previous page or `/`; on 401 show "Incorrect email or password"; add "Create account" link to signup page
- [ ] T042 [US3] Add auth state to `frontend/src/theme/Root.jsx`: on mount call `GET /api/user/profile`; store result in React context; expose `useAuth()` hook; add "Login" / "Logout" button to navbar based on auth state; logout calls `POST /api/auth/logout` then clears state

**Checkpoint**: User Story 3 complete — signup, login, logout, and 7-day session all working independently.

---

## Phase 7: User Story 4 — Personalized Level-Based Content (Priority: P2)

**Goal**: Logged-in learners select Beginner/Intermediate/Advanced; chapter content visibly adapts.

**Independent Test**: Log in, set level to "Beginner", open Chapter 1 — plain language, analogies visible. Switch to "Advanced" — technical depth, equations visible. Level saved after page reload.

**Prerequisite**: User Story 3 (T036–T042) complete.

### Implementation for User Story 4

- [ ] T043 [P] [US4] Author `content/chapters/01-intro-to-physical-ai/beginner.md` (simple analogies, no jargon, ~500 words) and `advanced.md` (technical depth, equations, research references, ~900 words)
- [ ] T044 [P] [US4] Author `content/chapters/02-humanoid-anatomy/beginner.md` and `advanced.md` following same length and depth guidelines as T043
- [ ] T045 [P] [US4] Author `content/chapters/03-sensors-and-perception/beginner.md` and `advanced.md`
- [ ] T046 [P] [US4] Author `content/chapters/04-locomotion-and-control/beginner.md` and `advanced.md`
- [ ] T047 [P] [US4] Author `content/chapters/05-learning-in-robots/beginner.md` and `advanced.md`
- [ ] T048 [P] [US4] Author `content/chapters/06-real-world-applications/beginner.md` and `advanced.md`
- [ ] T049 [US4] Create `backend/src/routes/user.js`: `GET /profile` (requireAuth) returns `{ id, email, level, createdAt }`; `PATCH /level` (requireAuth) validates level is one of `beginner|intermediate|advanced`, runs `UPDATE "user" SET level=$1 WHERE id=$2`, returns updated profile; mount in `backend/src/index.js` at `/api/user`
- [ ] T050 [US4] Create `frontend/src/components/LevelSelector/index.jsx`: dropdown with three options (Beginner / Intermediate / Advanced) shown only to logged-in users; on change calls `PATCH /api/user/level` and updates auth context; renders in navbar next to logout button; default shows current user level from auth context
- [ ] T051 [US4] Update `frontend/src/pages/chapter/[id].jsx`: read `level` from auth context (default `intermediate` if unauthenticated); append `?level={level}` to chapter fetch URL; re-fetch when level changes in context; add visible level badge ("Reading as: Beginner") below chapter title

**Checkpoint**: User Story 4 complete — level selection persists, content visibly differs across all three levels.

---

## Phase 8: User Story 5 — Urdu Translation (Priority: P3)

**Goal**: One-click Urdu translation of any chapter in ≤ 3s; technical terms stay in English; toggle back is instant.

**Independent Test**: Open Chapter 1, click "Translate to Urdu" — Urdu text appears within 3s, "neural network" and "sensor" remain in English. Click "View in English" — English appears instantly with no network call.

**Prerequisite**: Phase 1 deployed (translation is public — no auth required).

### Implementation for User Story 5

- [ ] T052 [US5] Add `translateChapter(chapterText, res)` function to `backend/src/services/claude.js`: builds the translation system prompt from research.md §4; calls `anthropic.messages.stream()` with `claude-haiku-4-5-20251001`; pipes SSE events `{"type":"delta","text":"..."}` and `{"type":"done"}` to `res`
- [ ] T053 [US5] Create `backend/src/routes/translate.js`: `POST /` validates `{ chapter_id, level }` in body; calls `chapters.getChapter(chapter_id, level)` to get chapter text; sets SSE headers; calls `translateChapter(content, res)`; returns 404 if chapter not found; mount in `backend/src/index.js` at `/api/translate`
- [ ] T054 [US5] Create `frontend/src/components/TranslateButton/index.jsx`: button labeled "Translate to Urdu" (or "عربی میں پڑھیں"); on click checks `localStorage.getItem('translation_{chapter_id}_{level}')` — if found renders cached Markdown instantly; if not found calls `POST /api/translate` via streaming fetch, accumulates text, on done saves to localStorage and renders; while loading shows "Translating..." with spinner; when translated, button label changes to "View in English" and click restores original from React state (no fetch)
- [ ] T055 [US5] Integrate `TranslateButton` into `frontend/src/pages/chapter/[id].jsx`: render button below chapter title; pass `chapterId` and current `level` as props; swap chapter body content based on translation state

**Checkpoint**: User Story 5 complete — translation works on all chapters, caches correctly, toggle is instant.

---

## Phase 9: User Story 6 — Summaries and Quizzes (Priority: P3)

**Goal**: Auto-generated summaries (3–5 points) and quizzes (3–5 MCQs) available per chapter; quiz results shown immediately on submit.

**Independent Test**: `GET /api/chapters/01-intro-to-physical-ai/summary` → `{ points: [...] }` with 3–5 items. `GET /api/chapters/01-intro-to-physical-ai/quiz` → question list without answers. `POST /quiz/submit` → results with correct_answer and explanation per question.

**Prerequisite**: Phase 1 deployed; chapter content (T011–T016) complete.

### Implementation for User Story 6

- [ ] T056 [P] [US6] Create `backend/scripts/generate-summaries.js`: for each chapter, call Claude Haiku with prompt "Read this chapter and generate exactly 5 key learning points as a JSON array of strings. Be concise (1 sentence each)."; write output to `content/summaries/{chapter-id}.summary.json`; run once with `node backend/scripts/generate-summaries.js`
- [ ] T057 [P] [US6] Create `backend/scripts/generate-quizzes.js`: for each chapter, call Claude Haiku with prompt "Generate exactly 4 multiple-choice questions from this chapter. Return JSON matching this schema: [{id, question, options: {A,B,C,D}, correct, explanation}]. Questions must be answerable from the chapter only."; write to `content/quizzes/{chapter-id}.quiz.json`; run once with `node backend/scripts/generate-quizzes.js`
- [ ] T058 [US6] Create `backend/src/routes/learning.js`: `GET /chapters/:id/summary` reads `content/summaries/{id}.summary.json`, returns `{ chapter_id, points }`; `GET /chapters/:id/quiz` reads quiz JSON and returns questions WITHOUT the `correct` field; `POST /chapters/:id/quiz/submit` validates `{ answers: [{question_id, selected}] }`, loads full quiz, scores answers, returns `{ score, total, results: [{question_id, correct, selected, correct_answer, explanation}] }`; mount in `backend/src/index.js`
- [ ] T059 [US6] Create `frontend/src/components/SummaryPanel/index.jsx`: collapsible panel triggered by "Summary" button below chapter title; renders an ordered list of 3–5 key points from `GET /api/chapters/:id/summary`; lazy-loads on first open; shows skeleton while fetching
- [ ] T060 [US6] Create `frontend/src/components/QuizWidget/index.jsx`: triggered by "Take Quiz" button; renders questions one at a time with A/B/C/D radio options; "Submit" button enabled only when all questions answered; on submit POSTs to `/api/chapters/:id/quiz/submit`; renders per-question result (✅ or ❌) with correct answer and explanation inline; shows final score "You got 3/4 correct"
- [ ] T061 [US6] Integrate `SummaryPanel` and `QuizWidget` into `frontend/src/pages/chapter/[id].jsx`: add "Summary" and "Take Quiz" buttons in a toolbar below chapter title; conditionally render panels when toggled

**Checkpoint**: User Story 6 complete — summary and quiz work independently for every chapter.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Deployment hardening, documentation, and final validation across all stories.

- [ ] T062 Create `docs/deployment.md`: step-by-step guide covering Qdrant collection creation, ingestion script, Neon migration, Railway backend deploy, Vercel frontend deploy, env var checklist, and Phase 1 validation checklist from quickstart.md
- [ ] T063 [P] Add error boundary in `frontend/src/theme/Root.jsx`: catch fetch errors and show "Something went wrong — please refresh" toast; never expose stack traces to user
- [ ] T064 [P] Verify `backend/.env` and `frontend/.env.local` are in `.gitignore` and NOT tracked by git; run `git ls-files --error-unmatch .env` to confirm
- [ ] T065 [P] Add `backend/src/middleware/errorHandler.js`: Express error middleware that logs error server-side and returns `{ error: { code, message } }` JSON; attach as last middleware in `backend/src/index.js`; ensure no stack traces leak to responses in production
- [ ] T066 Run full Phase 1 re-validation after polish: load each chapter on 375px mobile (Chrome DevTools), verify < 2s load, run 10 RAG spot-checks, confirm no API keys in browser network tab

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1, T001–T005)**: No dependencies — start immediately
- **Foundational (Phase 2, T006–T010)**: Requires Setup complete — blocks all user stories
- **US1 (Phase 3, T011–T020)**: Requires Foundational complete
- **US2 (Phase 4, T021–T030)**: Requires Foundational complete — can run parallel to US1
- **MVP Deployment (Phase 5, T031–T035)**: Requires US1 + US2 complete
- **US3 (Phase 6, T036–T042)**: Requires MVP Deployment validated
- **US4 (Phase 7, T043–T051)**: Requires US3 complete
- **US5 (Phase 8, T052–T055)**: Requires MVP Deployment (no auth needed for translation)
- **US6 (Phase 9, T056–T061)**: Requires MVP Deployment (chapter content must exist)
- **Polish (Phase 10, T062–T066)**: Requires all desired stories complete

### Within Each User Story

- Content authoring tasks marked [P] can all run in parallel
- Services before routes (e.g., T021 → T022 → T025 → T027)
- Backend routes before frontend components
- Components before page integration

---

## Parallel Execution Examples

### Phase 3 + Phase 4 in Parallel (after Foundational)

```
Stream A (US1): T011 → T012 → T013 → T014 → T015 → T016 (all parallel)
                then T017 → T018 → T019 → T020

Stream B (US2): T021 → T022 → T023 → T024 → T025 → T026 → T027 → T028 → T029 → T030
```

### Phase 7 Content Authoring in Parallel

```
T043, T044, T045, T046, T047, T048 — all 6 chapter variant pairs simultaneously
then T049 → T050 → T051 sequentially
```

### Phase 9 Generation Scripts in Parallel

```
T056 (generate-summaries.js) and T057 (generate-quizzes.js) — run simultaneously
then T058 → T059 → T060 → T061 sequentially
```

---

## Implementation Strategy

### MVP First (US1 + US2 only)

1. Complete Phase 1: Setup (T001–T005)
2. Complete Phase 2: Foundational (T006–T010)
3. Complete Phase 3: US1 — Readable Textbook (T011–T020)
4. Complete Phase 4: US2 — RAG Chatbot (T021–T030)
5. Complete Phase 5: Deploy to production (T031–T035)
6. **STOP and VALIDATE**: All Phase 1 acceptance criteria met
7. Demo and get feedback before Phase 2

### Incremental Delivery

- Phase 1 MVP → deploy → validate (**T001–T035**)
- Add Auth + Personalization → deploy → validate (**T036–T051**)
- Add Translation → deploy → validate (**T052–T055**)
- Add Learning Tools → deploy → validate (**T056–T061**)
- Polish → final production check (**T062–T066**)

---

## Task Summary

| Phase | User Story | Tasks | Parallelizable |
|-------|-----------|-------|----------------|
| Setup | — | T001–T005 | T002, T003, T004, T005 |
| Foundational | — | T006–T010 | T007, T008 |
| Phase 3 | US1 — Read Textbook | T011–T020 | T011–T016 (content) |
| Phase 4 | US2 — RAG Chatbot | T021–T030 | T021 |
| Phase 5 | MVP Deploy | T031–T035 | — |
| Phase 6 | US3 — Auth | T036–T042 | — |
| Phase 7 | US4 — Personalization | T043–T051 | T043–T048 (content) |
| Phase 8 | US5 — Translation | T052–T055 | — |
| Phase 9 | US6 — Summaries + Quizzes | T056–T061 | T056, T057 |
| Phase 10 | Polish | T062–T066 | T063, T064, T065 |
| **Total** | | **T001–T066 (66 tasks)** | |

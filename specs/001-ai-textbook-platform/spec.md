# Feature Specification: AI-Native Textbook Platform — Physical AI & Humanoid Robotics

**Feature Branch**: `001-ai-textbook-platform`
**Created**: 2026-03-26
**Status**: Draft
**Constitution**: `.specify/memory/constitution.md` v1.0.0

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Read the Textbook (Priority: P1)

A learner opens the platform and reads through the textbook chapters on Physical AI
and Humanoid Robotics. Navigation is simple, pages load fast, and the experience
works well on mobile.

**Why this priority**: Without readable content, nothing else in the platform has
value. This is the foundational deliverable of Phase 1.

**Independent Test**: Navigate to the platform URL, open any chapter, read it to
completion. The chapter must render fully, be readable on a phone screen, and load
in under 2 seconds.

**Acceptance Scenarios**:

1. **Given** a learner opens the platform, **When** they browse the chapter list,
   **Then** they see 6–8 titled chapters with estimated reading times.
2. **Given** a learner opens a chapter, **When** the page loads, **Then** all
   content is visible within 2 seconds on a standard mobile connection.
3. **Given** a learner reads a chapter on mobile, **When** they scroll,
   **Then** text is readable without horizontal scrolling and tap targets are
   at least 44px.
4. **Given** a learner finishes a chapter, **When** they reach the bottom,
   **Then** a clear link to the next chapter is visible.

---

### User Story 2 — Ask the RAG Chatbot (Priority: P1)

A learner types a question about the textbook content. The chatbot answers using
only information from the textbook and includes a citation (chapter + section)
with every response. If the answer is not in the textbook, the chatbot says so.

**Why this priority**: The RAG chatbot is the core AI feature that differentiates
this product from a static textbook. It belongs in Phase 1 MVP.

**Independent Test**: Ask 5 questions — 4 that are answerable from the textbook
and 1 that is not. Verify citations appear on all 4 answers and the 5th returns
exactly "Answer not found in textbook".

**Acceptance Scenarios**:

1. **Given** a learner types a question, **When** they submit it, **Then** a
   response appears within 5 seconds with the answer and a source citation.
2. **Given** a question whose answer exists in the textbook, **When** the chatbot
   responds, **Then** the response includes the chapter name and section heading
   as citation.
3. **Given** a question with no answer in the textbook, **When** the chatbot
   responds, **Then** the response is exactly: "Answer not found in textbook".
4. **Given** a learner asks a follow-up question in the same session,
   **When** they submit it, **Then** the chatbot treats it as a new independent
   query (no session memory required for MVP).
5. **Given** the chatbot is open on mobile, **When** a learner types and submits,
   **Then** the input and response are fully usable on a small screen.

---

### User Story 3 — Sign Up and Log In (Priority: P2)

A learner creates an account with email and password. On return visits they log in
and their preferences (level, reading progress) are saved to their profile.

**Why this priority**: Auth gates personalization. Phase 2 begins here.

**Independent Test**: Create an account, log out, log back in. Verify the session
persists and the user's selected level is retained.

**Acceptance Scenarios**:

1. **Given** a visitor clicks "Sign Up", **When** they submit a valid email and
   password, **Then** an account is created and they are logged in automatically.
2. **Given** a registered learner clicks "Log In", **When** they submit correct
   credentials, **Then** they are authenticated and redirected to their last
   position.
3. **Given** a learner submits an incorrect password, **When** the system
   responds, **Then** a user-friendly error message is shown (no account
   enumeration).
4. **Given** a logged-in learner closes and reopens the browser, **When** they
   return to the platform, **Then** their session is still active for at least
   7 days.

---

### User Story 4 — Personalized Level-Based Content (Priority: P2)

A logged-in learner selects their experience level (Beginner, Intermediate, or
Advanced). Chapter content then adapts to show explanations, examples, and
technical depth matching the selected level.

**Why this priority**: Personalization requires auth (US3) as a prerequisite.

**Independent Test**: Select "Beginner", open a chapter, note the explanation
style. Switch to "Advanced", reload the same chapter. Verify the technical depth
and example complexity are visibly different.

**Acceptance Scenarios**:

1. **Given** a logged-in learner opens their profile, **When** they select a
   level, **Then** the selection is saved and confirmed visually.
2. **Given** a learner has selected "Beginner", **When** they open a chapter,
   **Then** explanations use plain language, avoid jargon, and include
   introductory analogies.
3. **Given** a learner has selected "Advanced", **When** they open the same
   chapter, **Then** content includes technical depth, equations where relevant,
   and assumes prior robotics knowledge.
4. **Given** a learner changes their level mid-session, **When** they navigate
   to any chapter, **Then** content reflects the new level immediately.

---

### User Story 5 — Urdu Translation (Priority: P3)

A learner clicks "Translate to Urdu" on any chapter. The chapter content is
replaced with a readable Urdu translation. Technical terms remain in English.
A single click returns to the English version.

**Why this priority**: Phase 3 feature; depends on stable Phase 1 content.

**Independent Test**: Open a chapter in English, click "Translate to Urdu".
Verify the translation appears within 3 seconds, is readable (not word-for-word),
and technical terms like "neural network", "actuator", "SLAM" remain in English.

**Acceptance Scenarios**:

1. **Given** a learner opens any chapter, **When** they click "Translate to
   Urdu", **Then** the chapter body is replaced with Urdu text within 3 seconds.
2. **Given** the translated content is displayed, **When** a learner reads it,
   **Then** technical terms (e.g., "servo motor", "reinforcement learning") are
   unchanged and remain in English.
3. **Given** the Urdu translation is displayed, **When** a learner clicks
   "View in English", **Then** the original English content is restored instantly
   (from cache — no re-fetch required).
4. **Given** a translation request is in progress, **When** the learner
   navigates away, **Then** no error is thrown and the request is cancelled
   gracefully.

---

### User Story 6 — Chapter Summaries and Quizzes (Priority: P3)

A learner can open an auto-generated summary for any chapter and take a short
quiz to test their understanding. Results are shown immediately after submission.

**Why this priority**: Phase 3 enhancement; depends on stable textbook content.

**Independent Test**: Open a chapter summary and verify it covers the chapter's
key concepts in 3–5 bullet points. Complete a quiz and verify answers are revealed
immediately with explanations.

**Acceptance Scenarios**:

1. **Given** a learner opens a chapter, **When** they click "Summary",
   **Then** a 3–5 bullet point summary of that chapter appears within 3 seconds.
2. **Given** a learner opens the quiz for a chapter, **When** they submit answers,
   **Then** correct/incorrect feedback appears immediately with a one-sentence
   explanation per question.
3. **Given** a learner retakes a quiz, **When** the questions load,
   **Then** the question order may vary but all questions are drawn from the same
   chapter's content.

---

### Edge Cases

- What happens when the chatbot receives an empty question? → Input MUST be
  validated client-side; empty submissions are blocked.
- What happens if the vector DB is unreachable? → The chatbot MUST display a
  user-friendly error: "Chat is temporarily unavailable. Please try again."
- What happens when a translation request exceeds 3 seconds? → A loading
  indicator MUST be shown; if it exceeds 10 seconds, a timeout error is shown.
- What happens if a user signs up with an already-registered email? → A clear
  message MUST be shown without revealing whether the email is registered
  (prevent enumeration).
- What happens when a chapter has no quiz data yet? → The quiz button MUST be
  hidden, not shown as broken.

---

## Requirements *(mandatory)*

### Functional Requirements

**Textbook (Phase 1)**

- **FR-001**: The platform MUST display 6–8 chapters on Physical AI and
  Humanoid Robotics, each readable in 5–8 minutes.
- **FR-002**: Every chapter page MUST load fully within 2 seconds on a standard
  mobile connection (4G).
- **FR-003**: The platform MUST be fully usable on screens 375px wide and above
  with no horizontal scroll.
- **FR-004**: Navigation between chapters MUST require no more than 2 taps/clicks
  from any chapter page.

**RAG Chatbot (Phase 1)**

- **FR-005**: The chatbot MUST only use textbook content as its knowledge source.
- **FR-006**: Every chatbot response that contains an answer MUST include a
  citation identifying the source chapter and section.
- **FR-007**: When the answer is not in the textbook, the chatbot MUST respond
  with exactly: "Answer not found in textbook".
- **FR-008**: The chatbot MUST return a response within 5 seconds for 95% of
  queries.
- **FR-009**: Textbook content MUST be chunked with a size of 300–500 tokens
  and an overlap of 50–100 tokens for retrieval accuracy.
- **FR-010**: The top 3–5 most semantically relevant chunks MUST be retrieved
  per query and provided as context to the AI model.

**Authentication (Phase 2)**

- **FR-011**: Users MUST be able to sign up with email and password.
- **FR-012**: Users MUST be able to log in and maintain a session for at least 7 days.
- **FR-013**: Failed login attempts MUST NOT reveal whether the email is registered.
- **FR-014**: All authentication flows MUST use Better-Auth as the auth library.
- **FR-015**: User passwords MUST be hashed before storage; plaintext passwords
  MUST never be stored or logged.

**Personalization (Phase 2)**

- **FR-016**: Logged-in users MUST be able to select a learning level:
  Beginner, Intermediate, or Advanced.
- **FR-017**: Chapter content MUST visually differ across the three levels in
  explanation depth, example complexity, and assumed prior knowledge.
- **FR-018**: A user's selected level MUST persist across sessions.

**Urdu Translation (Phase 3)**

- **FR-019**: Every chapter MUST have a one-click "Translate to Urdu" button.
- **FR-020**: Urdu translation MUST complete within 3 seconds for a standard
  chapter (up to 2000 words).
- **FR-021**: Technical terms (e.g., "neural network", "actuator", "SLAM",
  "servo motor") MUST remain in English in all Urdu translations.
- **FR-022**: The English version MUST be restored instantly from client-side
  cache on toggle-back.

**Learning Tools (Phase 3)**

- **FR-023**: Each chapter MUST have an auto-generated summary of 3–5 key points.
- **FR-024**: Each chapter MUST have a quiz of 3–5 multiple-choice questions
  generated from chapter content.
- **FR-025**: Quiz results and correct answers MUST be shown immediately after
  submission, with a one-sentence explanation per answer.

---

### Key Entities

- **Chapter**: A textbook unit with a title, body content (multi-level variants),
  reading time estimate, order index, and associated vector embeddings.
- **Chunk**: A 300–500 token text segment derived from a chapter, with metadata
  (chapter ID, section heading, position). Stored in the vector database.
- **User**: An authenticated learner with email, hashed password, selected level,
  and reading progress. Stored in the relational database.
- **Session**: A user authentication session managed by Better-Auth with a 7-day
  TTL. Stored in the relational database.
- **ChatMessage**: A single question-answer exchange including the user's query,
  the retrieved chunks (context), the AI response, and the citation. Not persisted
  in MVP.
- **Translation**: A cached Urdu translation of a chapter, keyed by chapter ID
  and language code. Cached client-side in localStorage for instant toggle-back.
- **Quiz**: A set of 3–5 auto-generated multiple-choice questions for a chapter,
  with correct answers and explanations. Generated once and stored statically.
- **Summary**: A 3–5 point auto-generated summary for a chapter. Generated once
  and stored statically.

---

## Technical Architecture *(required — per user specification)*

> This section captures system-level design decisions. It complements the
> functional requirements above and is intended for the technical planning phase.

### RAG System Design

**Ingestion Pipeline** (run once per content update):

1. Each chapter's text is split into chunks of 300–500 tokens with 50–100 token
   overlap using a sentence-aware splitter (splits at sentence boundaries to
   preserve readability).
2. Each chunk is embedded using a free open-source embedding model
   (e.g., `sentence-transformers/all-MiniLM-L6-v2` via HuggingFace Inference API
   — free tier) producing a 384-dimensional vector.
3. Each vector is stored in Qdrant cloud (free tier: 1GB) with a payload
   containing: `chunk_text`, `chapter_id`, `chapter_title`, `section_heading`.

**Retrieval Flow** (per user query):

```
User query → embed query (same model) → cosine similarity search in Qdrant
(top_k=5) → retrieve chunk payloads → build prompt:
  [system]: "Answer only from the provided textbook excerpts. Include citation."
  [context]: <top 5 chunks with chapter + section labels>
  [user]: <query>
→ Claude Haiku API → stream response to client
```

**Citation format**: `(Source: Chapter N — Section Title)`

**Fallback**: If Qdrant returns 0 results above cosine threshold 0.55, skip
LLM call and return: "Answer not found in textbook".

---

### Personalization Logic

Three content variants are authored per chapter at content-creation time:

| Level        | Characteristics |
|--------------|-----------------|
| Beginner     | Plain language, analogies to everyday objects, no equations, conceptual only |
| Intermediate | Some technical terms defined inline, real-world examples, light formulas |
| Advanced     | Full technical vocabulary, equations, reference to research papers/systems |

At render time, the frontend reads the user's level from their session/profile
and requests the matching content variant via a query parameter
(`?level=beginner|intermediate|advanced`). If unauthenticated, the default is
`intermediate`.

The three variants are stored as separate Markdown files per chapter. The backend
serves the correct variant based on the query parameter. No runtime AI generation
is needed for personalization — all variants are pre-authored.

---

### Urdu Translation System

**Translation flow**:

1. On first "Translate to Urdu" click, the frontend calls
   `POST /api/translate` with `{ chapter_id, level }`.
2. The backend calls the Claude Haiku API with a strict prompt:
   ```
   Translate the following textbook chapter to Urdu.
   Rules:
   - Keep all technical terms in English (examples: neural network, actuator,
     SLAM, servo motor, reinforcement learning, torque, sensor fusion)
   - Write natural, readable Urdu — not word-for-word translation
   - Preserve all headings in their original structure
   ```
3. The translated text is returned and cached in the client's localStorage as
   `translation_{chapter_id}_{level}`.
4. On subsequent clicks (same session or return visit), the cached version is
   served instantly with no network call.

**Performance target**: Under 3 seconds for a 2000-word chapter using streaming.
The backend streams the translation to the frontend as it is generated.

---

### Authentication System (Better-Auth)

Better-Auth handles all auth flows. The system uses email + password
authentication with session cookies (HTTP-only, SameSite=Strict).

**Session management**:
- Session TTL: 7 days (rolling on activity)
- Sessions stored in Neon (PostgreSQL) via Better-Auth's built-in adapter
- No JWT — server-side sessions only for security simplicity

**Data stored per user**:
- `id` (UUID), `email`, `password_hash`, `level` (enum), `created_at`
- No PII beyond email is collected in MVP

**Protected routes**: All `/api/user/*` endpoints require a valid session cookie.
Unauthenticated requests return HTTP 401. The chatbot (`/api/chat`) is public
(no auth required) in Phase 1.

---

### API Structure

All endpoints are served from the backend service (Railway). Base path: `/api`.

**Phase 1 — Public**

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/chapters` | List all chapters (id, title, readingTime, order) |
| GET | `/api/chapters/:id` | Get chapter content (`?level=beginner\|intermediate\|advanced`) |
| POST | `/api/chat` | Submit a RAG query; body: `{ question: string }` |

**Phase 2 — Auth**

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signup` | Create account; body: `{ email, password }` |
| POST | `/api/auth/login` | Authenticate; sets session cookie |
| POST | `/api/auth/logout` | Invalidate session |
| GET | `/api/user/profile` | Get current user's level and progress (auth required) |
| PATCH | `/api/user/level` | Update learning level; body: `{ level }` (auth required) |

**Phase 3 — Content Generation**

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/translate` | Translate chapter to Urdu; body: `{ chapter_id, level }` |
| GET | `/api/chapters/:id/summary` | Get chapter summary (pre-generated) |
| GET | `/api/chapters/:id/quiz` | Get chapter quiz (pre-generated) |
| POST | `/api/chapters/:id/quiz/submit` | Submit quiz answers; body: `{ answers: [] }` |

All endpoints return JSON. Errors use the format:
`{ error: { code: string, message: string } }`.

---

### Data Flow

```
┌─────────────────────────────────────────────────────────┐
│  FRONTEND (Docusaurus → Vercel)                         │
│  - Renders chapters from /api/chapters/:id              │
│  - Chat widget → POST /api/chat                         │
│  - Auth forms → POST /api/auth/*                        │
│  - Translation cache in localStorage                    │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS REST calls
┌────────────────────▼────────────────────────────────────┐
│  BACKEND API (Node.js → Railway)                        │
│  - Serves chapter Markdown files                        │
│  - Handles auth via Better-Auth ↔ Neon                 │
│  - On /api/chat:                                        │
│      1. Embed query → query Qdrant                      │
│      2. Retrieve top-5 chunks                           │
│      3. Call Claude Haiku API                           │
│      4. Stream response to frontend                     │
│  - On /api/translate:                                   │
│      1. Call Claude Haiku API with translation prompt   │
│      2. Stream response to frontend                     │
└──────┬─────────────────────┬───────────────────────────┘
       │                     │
┌──────▼──────┐    ┌─────────▼──────────┐
│ Qdrant Cloud│    │ Neon (PostgreSQL)  │
│ - Chunk     │    │ - users            │
│   vectors   │    │ - sessions         │
│ - Metadata  │    │ (Better-Auth)      │
└─────────────┘    └────────────────────┘
                             │ (external)
                   ┌─────────▼──────────┐
                   │ Claude Haiku API   │
                   │ (Anthropic)        │
                   └────────────────────┘
```

**Key data flow rules**:
- The frontend NEVER calls Qdrant or Claude directly — all AI calls go through
  the backend to keep API keys server-side.
- Chapter Markdown files are served by the backend, not embedded in the Docusaurus
  build, to support level-based content switching without a frontend rebuild.
- Auth session cookies are HTTP-only; the frontend never reads them directly.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A learner can read the complete textbook (all 6–8 chapters) in
  under 45 minutes total.
- **SC-002**: Every chapter page is fully visible within 2 seconds on a mobile
  device on a standard connection.
- **SC-003**: 95% of chatbot queries return a response (answer or "not found")
  within 5 seconds.
- **SC-004**: 100% of chatbot answers that draw from textbook content include a
  source citation.
- **SC-005**: The chatbot returns "Answer not found in textbook" for all questions
  that cannot be answered from the textbook content (zero hallucinations in
  spot-check of 20 out-of-scope questions).
- **SC-006**: The platform is fully usable on screen widths from 375px upward
  with no layout breakage.
- **SC-007**: Account creation and login each complete in under 10 seconds
  end-to-end.
- **SC-008**: Urdu translation of any chapter completes within 3 seconds and
  all technical terms remain in English (verified by manual review of 5 chapters).
- **SC-009**: Toggle between English and Urdu is instant (under 100ms) after the
  first translation is cached.
- **SC-010**: Content visibly differs between Beginner and Advanced levels
  for every chapter (validated by review of 3 chapters per level).
- **SC-011**: The entire platform runs on free-tier infrastructure with zero
  monthly infrastructure cost at launch (pre-scale).

---

## Assumptions

- All chapter content is authored before development begins (content is a
  prerequisite, not a deliverable of the engineering work).
- Three content variants (Beginner / Intermediate / Advanced) are authored for
  each chapter as Markdown files.
- Quiz questions and summaries for Phase 3 are pre-generated as static JSON
  files — no runtime generation is required.
- The Claude Haiku API is the AI backend for both RAG generation and translation
  (usage cost is expected to be minimal at launch scale).
- HuggingFace Inference API (free tier) is used for text embeddings during
  ingestion; if rate-limited, a one-time local embedding run is an acceptable
  alternative.
- No email verification is required for MVP signup.
- User reading progress tracking (last chapter read) is a nice-to-have and
  is deferred to Phase 2 scope review.

---

## Out of Scope

- Social login (Google, GitHub, etc.) — not in current phases.
- Multi-language support beyond Urdu.
- User-generated content or community features.
- Admin dashboard for content management.
- Offline / PWA support.
- Heavy robotics simulations or code execution environments.
- Analytics or usage tracking dashboards.

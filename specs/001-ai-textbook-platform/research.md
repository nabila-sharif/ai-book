# Research: AI-Native Textbook Platform

**Branch**: `001-ai-textbook-platform` | **Date**: 2026-03-26
**Purpose**: Resolve all technical unknowns from the spec before design phase.

---

## 1. Embedding Model Selection

**Decision**: `sentence-transformers/all-MiniLM-L6-v2` via HuggingFace Inference API

**Rationale**:
- Free tier on HuggingFace Inference API (up to 30,000 characters/month per model)
- 384-dimensional vectors — compact, fast, low storage cost in Qdrant
- Strong semantic similarity for English technical text
- Well-documented, widely used for RAG pipelines
- No GPU required for inference at this scale

**Alternatives considered**:

| Option | Cost | Dims | Notes |
|--------|------|------|-------|
| OpenAI text-embedding-3-small | $0.02/1M tokens | 1536 | Not free tier |
| Cohere embed-english-v3.0 | Free tier (100/min) | 1024 | Good quality, rate-limited |
| all-MiniLM-L6-v2 (HuggingFace) | Free | 384 | ✅ Chosen — sufficient quality, free |
| Local sentence-transformers | Free (local compute) | 384 | Fallback if HF rate-limits |

**Fallback**: If HuggingFace Inference API rate-limits during ingestion (one-time run),
run `sentence-transformers` locally via Node.js `@xenova/transformers` package
(WASM-based, no Python required).

---

## 2. Chunking Strategy

**Decision**: Recursive sentence-aware splitter, target 400 tokens, 75-token overlap

**Rationale**:
- 400 tokens (≈ 300 words) is large enough to contain a complete idea/paragraph
  but small enough to give precise citations
- 75-token overlap preserves sentence continuity across chunk boundaries
- Sentence-aware split (never mid-sentence) preserves readability in retrieved chunks
- At 400 tokens per chunk, a 600-word chapter section → ~2 chunks → manageable
- Total estimated chunks for 8 chapters × 3 variants × ~10 chunks = ~240 chunks
  (well within Qdrant free tier 1GB)

**Chunk payload schema**:
```json
{
  "chunk_text": "...",
  "chapter_id": "01-intro-to-physical-ai",
  "chapter_title": "Introduction to Physical AI",
  "section_heading": "What is Physical AI?",
  "level": "intermediate",
  "chunk_index": 3,
  "token_count": 387
}
```

**Note**: Index all three level variants. This means the RAG chatbot answers from
the intermediate-level chunks by default (best general vocabulary). The level is
not used for filtering RAG results — it is only used for chapter page rendering.

---

## 3. RAG Retrieval Parameters

**Decision**: Top-K = 5, cosine similarity threshold = 0.55

**Rationale**:
- K=5 provides sufficient context (~2000 tokens) to answer most single-concept
  questions without overloading Claude Haiku's context window
- Threshold 0.55 is empirically standard for all-MiniLM-L6-v2 on technical text:
  - Below 0.55: retrieves too many irrelevant chunks → noisy context
  - Above 0.65: too strict → misses paraphrased question matches
- If all 5 results are below 0.55 → fallback "Answer not found in textbook"

**Prompt template** (sent to Claude Haiku):
```
System: You are a teaching assistant for a textbook on Physical AI and Humanoid
Robotics. Answer the user's question using ONLY the provided textbook excerpts.
Every answer MUST include a citation in this format: (Source: Chapter N — Section Title).
If the excerpts do not contain enough information to answer the question, respond
with exactly: "Answer not found in textbook". Do not use outside knowledge.

Context:
[Excerpt 1 — Chapter: {chapter_title} | Section: {section_heading}]
{chunk_text}

[Excerpt 2 — ...]
...

User: {question}
```

---

## 4. Claude Haiku API — Chat + Translation

**Decision**: `claude-haiku-4-5-20251001` for both RAG generation and Urdu translation

**Rationale**:
- Fastest Claude model, lowest cost ($0.25/M input, $1.25/M output tokens)
- Sufficient reasoning quality for citation-based QA and translation
- Streaming supported via Anthropic SDK — enables < 5s perceived response time
- Single API key for both features (simpler secrets management)
- At launch scale, estimated monthly cost < $5

**Translation system prompt**:
```
You are a translator. Translate the following textbook chapter from English to Urdu.

Rules (MUST follow):
1. Write natural, flowing Urdu — not word-for-word translation
2. Keep ALL technical terms in English: neural network, actuator, SLAM, servo motor,
   reinforcement learning, torque, sensor fusion, proprioception, kinematics,
   dynamics, locomotion, humanoid, exoskeleton, LiDAR, IMU, end-effector,
   trajectory planning, inverse kinematics
3. Preserve all Markdown headings exactly as they appear
4. Preserve all numbered lists and bullet points structure
5. Do not add commentary or translator notes

Chapter to translate:
{chapter_text}
```

---

## 5. Better-Auth Configuration

**Decision**: Better-Auth with email+password, server-side sessions, Neon PostgreSQL adapter

**Rationale**:
- Constitution-mandated library
- Server-side sessions (no JWT) — simpler security model, sessions revocable
- HTTP-only SameSite=Strict cookies — XSS/CSRF safe
- Neon adapter available via `@better-auth/adapter-pg` — no extra service needed
- 7-day rolling session TTL sufficient for learner use pattern

**Schema managed by Better-Auth** (auto-migrated):
- `user` table: id, email, password_hash, created_at, updated_at
- `session` table: id, user_id, expires_at, created_at
- Custom column added: `user.level` (enum: beginner | intermediate | advanced)

---

## 6. Free-Tier Limits Assessment

| Service | Free Tier | Estimated Usage at Launch | Headroom |
|---------|-----------|--------------------------|---------|
| Vercel | 100GB bandwidth, unlimited deploys | < 1GB/month | ✅ Safe |
| Railway | $5/month credit | ~$2–3/month (512MB RAM) | ✅ Safe |
| Qdrant Cloud | 1GB storage, 1 cluster | ~50MB (240 chunks × 1.5KB) | ✅ Safe |
| Neon | 0.5GB storage, 10 branches | < 10MB (users + sessions) | ✅ Safe |
| HuggingFace | 30K chars/month (inference) | One-time ingestion only | ✅ Safe |
| Anthropic API | Pay-per-use | ~$5/month at launch | ✅ Minimal cost |

---

## 7. Docusaurus + Dynamic Content Strategy

**Decision**: Docusaurus renders chapter pages that fetch content from the backend API
(not from built-in `docs/` MDX processing).

**Rationale**:
- Docusaurus's built-in `docs/` plugin processes Markdown at build time — it cannot
  serve different content per user level at runtime.
- Fetching chapter content from `/api/chapters/:id?level=` enables level-switching
  without a frontend rebuild.
- The `content/chapters/` directory is committed to the repo and read by the backend
  at runtime using `fs.readFile` — no database needed for content.
- Docusaurus still handles routing, layout, sidebar, and mobile styles.
- The chapter page (`/chapter/[id]`) is a custom React page (not a `.mdx` doc)
  that renders fetched Markdown via `react-markdown`.

**Markdown rendering**: `react-markdown` + `remark-gfm` (GitHub-Flavored Markdown
support for tables and checkboxes).

---

## 8. Mobile-First Implementation Notes

- Docusaurus default theme is already responsive and mobile-optimized.
- Chat widget: floating button (bottom-right), full-screen modal on mobile,
  side panel on desktop.
- Level selector: dropdown in navbar on desktop, bottom sheet on mobile.
- Translation button: inline with chapter title, same size on all breakpoints.
- Font size minimum: 16px body text (no squinting on mobile).
- Tap targets: minimum 44×44px per Apple HIG / WCAG guidelines.

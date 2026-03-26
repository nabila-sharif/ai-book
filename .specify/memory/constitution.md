<!--
  SYNC IMPACT REPORT
  ==================
  Version change: (none — initial fill) → 1.0.0
  Modified principles: N/A (initial population from template)
  Added sections:
    - Core Principles (I–VII)
    - Technology Stack
    - Development Workflow
    - Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md  ✅ Constitution Check section aligns
    - .specify/templates/spec-template.md  ✅ Scope/requirements align
    - .specify/templates/tasks-template.md ✅ Phase structure aligns with delivery phases
  Deferred TODOs:
    - RATIFICATION_DATE: set to today (2026-03-26) as first ratification
-->

# AI-Native Textbook: Physical AI & Humanoid Robotics — Constitution

## Core Principles

### I. Simplicity & Speed First

The product MUST feel fast, clean, and minimal. Every UI decision, API call, and
content structure MUST prioritize perceived and actual performance over feature richness.
No unnecessary animations, heavy dependencies, or complex layouts are permitted.
YAGNI applies: build what is needed for the current phase only.

### II. Content Authority (RAG Grounding)

The RAG chatbot MUST answer only from textbook content. Responses MUST include
source citations. If an answer is not found in the textbook, the system MUST respond
with exactly: "Answer not found in textbook". Hallucinated or externally-sourced
answers are a zero-tolerance violation. Chunk size: 300–500 tokens; overlap: 50–100 tokens.

### III. Phase-Gated Delivery

Features MUST be built in the defined phase order:
- Phase 1 (MVP): Docusaurus textbook + RAG chatbot + deployment (Vercel / Railway / Qdrant / Neon)
- Phase 2: Authentication (Better-Auth) + level-based personalization
- Phase 3: Urdu translation + summaries + quizzes + learning boosters

No Phase 2 or Phase 3 work MAY begin before Phase 1 is deployed and validated.
Each phase MUST be independently deployable and demonstrable.

### IV. Learner-Centered Design

All content and UI decisions MUST serve the learner's journey, not technical elegance.
The full textbook MUST be readable in under 45 minutes (6–8 short chapters).
Content MUST adapt to the user's selected level (Beginner / Intermediate / Advanced)
by adjusting explanation depth, examples, and technical detail — not by hiding content.

### V. Translation Quality

Urdu translation MUST be readable, not literal. Technical terms MUST remain in English.
Translation MUST be triggered by a single user action (one-click). Response time for
translation MUST be fast (target: under 3 seconds per chapter). Auto-generated
translations that degrade readability are unacceptable.

### VI. Security & Secrets

Secrets and tokens MUST NEVER be hardcoded. All credentials MUST use `.env` files
and be documented in `.env.example`. Authentication MUST use Better-Auth.
No session tokens, API keys, or database credentials may appear in source code or logs.

### VII. Smallest Viable Change

Every implementation task MUST represent the smallest diff that delivers the stated
acceptance criteria. Refactoring unrelated code, adding unrequested features, or
gold-plating solutions is prohibited. Complexity MUST be justified in the plan's
Complexity Tracking table.

## Technology Stack

- **Frontend**: Docusaurus (React-based) — deployed to Vercel
- **Backend / API**: Node.js or Python service — deployed to Railway
- **Vector Database**: Qdrant — for RAG embeddings
- **Relational Database**: Neon (PostgreSQL) — for user data and auth
- **Authentication**: Better-Auth (Phase 2)
- **Translation**: LLM-backed Urdu translation API (Phase 3)
- **AI / RAG**: Claude API (claude-sonnet-4-6 or claude-haiku-4-5) for chatbot responses

Technology choices outside this list MUST be justified in an ADR before adoption.

## Development Workflow

- Clarify requirements before writing code; keep business understanding separate
  from the technical plan.
- Every feature follows: `/sp.specify` → `/sp.plan` → `/sp.tasks` → implement.
- PRs MUST be small, focused, and reference the task ID they fulfill.
- All deployment configs (Vercel, Railway, Qdrant, Neon) MUST be documented in
  `docs/deployment.md` before Phase 1 is considered complete.
- Mobile-first responsive design MUST be verified before marking any UI task done.
- RAG accuracy MUST be manually spot-checked against at least 5 questions per
  chapter before Phase 1 deployment.

## Governance

This constitution supersedes all other practices and README guidance. Amendments
require: (1) a written rationale, (2) a version bump per semantic versioning rules
(MAJOR: principle removal/redefinition; MINOR: new principle/section; PATCH: wording),
and (3) propagation checks across all dependent templates (plan, spec, tasks).

All PRs and design reviews MUST include a "Constitution Check" confirming no
principles are violated. Complexity violations MUST be logged in the plan's
Complexity Tracking table with justification.

**Versioning policy**:
- MAJOR bump: backward-incompatible governance or principle change
- MINOR bump: new principle or material expansion
- PATCH bump: clarification, wording, non-semantic refinement

**Version**: 1.0.0 | **Ratified**: 2026-03-26 | **Last Amended**: 2026-03-26

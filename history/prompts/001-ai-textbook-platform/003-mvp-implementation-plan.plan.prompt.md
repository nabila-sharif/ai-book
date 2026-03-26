---
id: "003"
title: MVP Implementation Plan
stage: plan
date: 2026-03-26
surface: agent
model: claude-sonnet-4-6
feature: 001-ai-textbook-platform
branch: 001-ai-textbook-platform
user: nabila sharif
command: /sp.plan
labels: ["plan","rag","docusaurus","better-auth","qdrant","neon","railway","vercel","node.js"]
links:
  spec: specs/001-ai-textbook-platform/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-ai-textbook-platform/plan.md
  - specs/001-ai-textbook-platform/research.md
  - specs/001-ai-textbook-platform/data-model.md
  - specs/001-ai-textbook-platform/quickstart.md
  - specs/001-ai-textbook-platform/contracts/openapi.yaml
  - history/prompts/001-ai-textbook-platform/003-mvp-implementation-plan.plan.prompt.md
tests:
  - none
---

## Prompt

Based on the specification, create a clear development plan.

Break into phases:
- MVP first
- Then enhancements

Include:
- Tech stack decisions
- Folder structure
- Deployment flow (Vercel, Railway, Qdrant, Neon)

Keep plan practical and executable.

## Response snapshot

Generated 5 planning artifacts for branch `001-ai-textbook-platform`:

**plan.md** — Full implementation plan with Technical Context, Constitution Check
(all 7 principles ✅), Project Structure (frontend/ + backend/ + content/),
deployment flow diagram, env vars, and 3-phase delivery breakdown.

**research.md** — 8 research decisions: embedding model (all-MiniLM-L6-v2 via HuggingFace
free tier), chunking (400 tokens, 75 overlap), RAG params (top-5, cosine 0.55),
Claude Haiku for chat + translation, Better-Auth sessions, free-tier limits assessment,
Docusaurus + dynamic content strategy, mobile-first notes.

**data-model.md** — 5 storage definitions: filesystem (chapter Markdown + meta.json),
Qdrant (textbook_chunks collection schema), Neon PostgreSQL (user + session tables),
localStorage (translation cache), static JSON (quizzes + summaries for Phase 3).

**contracts/openapi.yaml** — Full OpenAPI 3.0 spec: 12 endpoints across 3 phases
(chapters, chat/SSE, auth, user, translate/SSE, summary, quiz).

**quickstart.md** — Step-by-step local setup, ingestion, migration, dev server start,
production deploy to Vercel + Railway, and Phase 1 validation checklist.

## Outcome

- ✅ Impact: Complete plan ready for `/sp.tasks` to generate actionable task list
- 🧪 Tests: none (plan documents — no executable tests)
- 📁 Files: plan.md, research.md, data-model.md, quickstart.md, contracts/openapi.yaml
- 🔁 Next prompts: /sp.tasks to generate tasks.md for Phase 1 implementation
- 🧠 Reflection: All free-tier infrastructure fits within limits; no ADR needed as tech stack was constitution-mandated; folder structure cleanly separates frontend/backend/content

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): Constitution Check all 7 principles ✅ PASS
- Prompt variant (if applicable): initial
- Next experiment: run /sp.tasks for Phase 1 tasks

---
id: "002"
title: Full Platform Technical Specification
stage: spec
date: 2026-03-26
surface: agent
model: claude-sonnet-4-6
feature: 001-ai-textbook-platform
branch: 001-ai-textbook-platform
user: nabila sharif
command: /sp.specify
labels: ["spec","rag","auth","personalization","urdu-translation","api","docusaurus","better-auth","qdrant"]
links:
  spec: specs/001-ai-textbook-platform/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-ai-textbook-platform/spec.md
  - specs/001-ai-textbook-platform/checklists/requirements.md
  - history/prompts/001-ai-textbook-platform/002-full-platform-technical-spec.spec.prompt.md
tests:
  - none
---

## Prompt

sp.specify

Use the provided constitution.

Convert it into a detailed technical specification.

Focus on:
- Simplicity and clean architecture
- Free-tier tools only
- Low-latency design
- Mobile-first experience

Clearly define:
- RAG system (chunking, embeddings, retrieval flow)
- Personalization logic (Beginner / Intermediate / Advanced)
- Urdu translation system (fast + readable, keep technical terms in English)
- Auth system (Better-Auth)
- API structure (endpoints)
- Data flow between frontend, backend, and vector DB

Avoid over-engineering.
Keep everything minimal, fast, and production-ready.

## Response snapshot

Created `specs/001-ai-textbook-platform/spec.md` on branch `001-ai-textbook-platform`.

Spec covers all 6 user stories (prioritized P1–P3 across 3 phases), 25 functional
requirements, 8 key entities, 11 measurable success criteria, and a Technical
Architecture section with:
- RAG system: HuggingFace embeddings → Qdrant (top-5 retrieval, cosine 0.55 threshold) → Claude Haiku streaming
- Personalization: 3 pre-authored content variants per chapter (Beginner/Intermediate/Advanced), served by query param
- Translation: Claude Haiku with strict prompt, client-side localStorage cache for instant toggle-back
- Auth: Better-Auth with email+password, HTTP-only session cookies, 7-day TTL, Neon storage
- API: 12 endpoints across 3 phases (GET/POST chapters, chat, auth, translate, quiz, summary)
- Data flow diagram: Frontend → Backend (Railway) → Qdrant + Neon + Claude Haiku API

All free-tier infrastructure: Vercel (frontend), Railway (backend), Qdrant Cloud free, Neon free.
Quality checklist: all items pass. No NEEDS CLARIFICATION markers.

## Outcome

- ✅ Impact: Complete technical specification ready for `/sp.plan`
- 🧪 Tests: none (spec document — no executable tests)
- 📁 Files: specs/001-ai-textbook-platform/spec.md, specs/001-ai-textbook-platform/checklists/requirements.md
- 🔁 Next prompts: /sp.plan to generate architecture plan and tasks
- 🧠 Reflection: User requested a technical spec beyond standard template scope; Technical Architecture section added as explicit extra section while keeping FR/SC user-focused per template guidelines

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): quality checklist all pass
- Prompt variant (if applicable): initial
- Next experiment: run /sp.plan for Phase 1 MVP (textbook + RAG chatbot)

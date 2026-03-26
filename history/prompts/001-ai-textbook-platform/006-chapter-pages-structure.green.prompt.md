---
id: "006"
title: Chapter Pages Structure Refactor
stage: green
date: 2026-03-26
surface: agent
model: claude-sonnet-4-6
feature: 001-ai-textbook-platform
branch: 001-ai-textbook-platform
user: nabila sharif
command: /sp.implement
labels: ["implement","docusaurus","pages","routing","refactor","components"]
links:
  spec: specs/001-ai-textbook-platform/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/lib/api.js
  - frontend/src/components/Icons/index.jsx
  - frontend/src/components/ReadingProgressBar/index.jsx
  - frontend/src/components/ReadingProgressBar/ReadingProgressBar.module.css
  - frontend/src/pages/chapter/index.jsx
  - frontend/src/pages/chapter.jsx
  - frontend/src/pages/index.jsx
  - frontend/src/pages/404.jsx
  - frontend/src/components/ChatWidget/index.jsx
tests:
  - Manual: http://localhost:3000/ — chapter list loads, cards link to /chapter/?id=...
  - Manual: /chapter/?id=01-intro-to-physical-ai — reading progress bar visible while scrolling
  - Manual: /chapter/?id=invalid — error state + back link shown
  - Manual: /nonexistent-page — custom 404 page renders
  - Manual: /chapter?id=... (no slash) — redirect to /chapter/?id=... works
---

## Prompt

Task: Create chapter pages structure
Keep output clean, structured, and production-ready.
Avoid unnecessary complexity.

## Response snapshot

Reorganised frontend pages structure:

- `frontend/src/lib/api.js` — centralised API client (`createApi` + `useApi` hook); all fetch calls DRY
- `frontend/src/components/Icons/index.jsx` — shared SVG icon set (ArrowLeft/Right, Clock, Send, Close, Chat, Book)
- `frontend/src/components/ReadingProgressBar/` — scroll-tracked progress bar, fixed below navbar
- `frontend/src/pages/chapter/index.jsx` — canonical chapter reader at `/chapter/`; uses `useApi`, shared icons, ReadingProgressBar
- `frontend/src/pages/chapter.jsx` — redirect shim: `/chapter?id=...` → `/chapter/?id=...` (backwards compat)
- `frontend/src/pages/index.jsx` — updated to use `useApi` and shared Icons; links point to `/chapter/?id=`
- `frontend/src/pages/404.jsx` — custom 404 page with back-to-chapters CTA
- `frontend/src/components/ChatWidget/index.jsx` — updated to use `useApi` and shared Icons

## Outcome

- ✅ Impact: Clean, DRY pages structure; no duplicated fetch logic; canonical routes
- 🧪 Tests: manual validation list above
- 📁 Files: 8 files created/updated
- 🔁 Next prompts: /sp.implement for Phase 4 (US2 — RAG backend services T021–T030)
- 🧠 Reflection: Docusaurus directory convention used for chapter/index.jsx; chapter.jsx kept as redirect shim since files cannot be deleted with available tools

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): follow-up implement
- Next experiment: implement RAG backend (T021–T027)

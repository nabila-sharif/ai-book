---
id: "004"
title: Platform Task Breakdown
stage: tasks
date: 2026-03-26
surface: agent
model: claude-sonnet-4-6
feature: 001-ai-textbook-platform
branch: 001-ai-textbook-platform
user: nabila sharif
command: /sp.tasks
labels: ["tasks","mvp","rag","auth","personalization","urdu-translation","quiz","docusaurus"]
links:
  spec: specs/001-ai-textbook-platform/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-ai-textbook-platform/tasks.md
  - history/prompts/001-ai-textbook-platform/004-platform-task-breakdown.tasks.prompt.md
tests:
  - none
---

## Prompt

Break the plan into small, ordered, actionable tasks.

Each task should:
- Be specific
- Be executable in 30–90 minutes
- Include clear input/output

Group tasks by phases:
- Phase 1 (MVP)
- Phase 2
- Phase 3

Avoid vague tasks.

## Response snapshot

Generated `specs/001-ai-textbook-platform/tasks.md` with 66 tasks across 10 phases:

- Phase 1 Setup: T001–T005 (repo scaffold, installs, .env.example, .gitignore)
- Phase 2 Foundational: T006–T010 (Express app, Dockerfile, chapter service, content structure, Docusaurus config)
- Phase 3 US1 Read Textbook: T011–T020 (6 chapter intermediate.md files, chapter routes, chapter list page, chapter detail page, mobile CSS)
- Phase 4 US2 RAG Chatbot: T021–T030 (embeddings service, Qdrant service, collection script, Claude service, RAG service, ingest script, chat route, ChatWidget, ChatWidget CSS, Root.jsx mount)
- Phase 5 MVP Deploy: T031–T035 (create collection, ingest, Railway deploy, Vercel deploy, validation)
- Phase 6 US3 Auth: T036–T042 (Better-Auth migration, level column migration, auth routes, requireAuth middleware, signup page, login page, auth state in Root)
- Phase 7 US4 Personalization: T043–T051 (12 content variant files, user routes, LevelSelector, chapter page update)
- Phase 8 US5 Translation: T052–T055 (translateChapter service, translate route, TranslateButton, integration)
- Phase 9 US6 Summaries+Quizzes: T056–T061 (generate scripts, learning routes, SummaryPanel, QuizWidget, integration)
- Phase 10 Polish: T062–T066 (deployment docs, error boundary, .gitignore check, error handler, final validation)

All tasks have exact file paths, are independently executable in 30–90 min, and follow checklist format.

## Outcome

- ✅ Impact: 66 actionable tasks ready for immediate implementation
- 🧪 Tests: none (not requested — no TDD tasks)
- 📁 Files: specs/001-ai-textbook-platform/tasks.md
- 🔁 Next prompts: /sp.implement to start executing tasks, beginning with T001
- 🧠 Reflection: US1 and US2 (both P1) can run in parallel after Foundational — key parallelization opportunity for faster MVP delivery

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): all tasks have IDs, file paths, story labels where required
- Prompt variant (if applicable): initial
- Next experiment: /sp.implement Phase 1 + Phase 2 foundational tasks first

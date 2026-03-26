---
id: "001"
title: Initial Project Constitution
stage: constitution
date: 2026-03-26
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: nabila sharif
command: /sp.constitution
labels: ["constitution","setup","robotics","textbook","rag","docusaurus"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - history/prompts/constitution/001-initial-project-constitution.constitution.prompt.md
tests:
  - none
---

## Prompt

# Project Constitution: AI-Native Textbook for Physical AI & Humanoid Robotics

---

## 1. Mission

Build a fully AI-native, interactive, and intelligent textbook to teach **Physical AI & Humanoid Robotics**.

The product must feel like a **real AI-powered education platform**:

* Fast
* Simple
* Clean UI
* Highly interactive

---

## 2. Core Deliverables

1. A Docusaurus-based interactive textbook

   * 6–8 short, modern, easy-to-read chapters
   * Total reading time < 45 minutes

2. A fully functional RAG chatbot

   * Answers ONLY from textbook content
   * Provides grounded, citation-based responses

3. User Authentication

   * Signup/Login using Better-Auth

4. Personalized Content

   * Content adapts based on user-selected level

5. Urdu Translation

   * One-click translation for every chapter

6. Auto-generated Learning Tools

   * Chapter summaries
   * Quizzes
   * Learning boosters

---

## 3. Phases (Execution Strategy)

### Phase 1 (MVP - Must Have)

* Textbook (Docusaurus)
* RAG chatbot (accurate + citations)
* Deployment (Vercel + Railway)

### Phase 2

* Authentication (Better-Auth)
* Personalization (level-based content)

### Phase 3

* Urdu Translation
* Summaries + Quizzes + Boosters

---

## 4. Success Criteria

* Clean UI, fast loading, mobile-friendly

* Full textbook readable in under 45 minutes

* RAG responses:

  * Accurate
  * Grounded in content
  * Include source citations

* Personalization visibly improves learning experience

* Urdu translation:

  * Fast
  * High-quality
  * Readable

* Fully deployed system:

  * Frontend → Vercel
  * Backend → Railway
  * Vector DB → Qdrant
  * Database → Neon

---

## 5. Non-Goals

* No unnecessary animations
* No long or complex chapters
* No heavy robotics coding (education-focused only)
* No complex UI — keep it minimal and readable

---

## 6. User Stories (Prioritized)

1. As a learner, I want to read the textbook smoothly
2. As a learner, I want to ask questions via chatbot
3. As a learner, I want content based on my level
4. As a learner, I want Urdu translation
5. As a learner, I want summaries and quizzes
6. As an admin, I want clean architecture and deployment

---

## 7. Personalization Rules

* User selects level:

  * Beginner
  * Intermediate
  * Advanced

* Content adapts based on level:

  * Explanation depth
  * Examples
  * Technical detail

---

## 8. RAG System Rules

* Answer ONLY from textbook content

* Always include source citation

* Use chunking:

  * Chunk size: 300–500 tokens
  * Overlap: 50–100 tokens

* If answer not found:

  * Respond with:
    "Answer not found in textbook"

---

## 9. Translation Rules

* One-click Urdu translation
* Maintain readability (no literal translation)
* Keep technical terms in English
* Ensure fast response time

## Response snapshot

Populated `.specify/memory/constitution.md` from scratch with 7 core principles (Simplicity & Speed First, Content Authority/RAG Grounding, Phase-Gated Delivery, Learner-Centered Design, Translation Quality, Security & Secrets, Smallest Viable Change), a Technology Stack section, a Development Workflow section, and a Governance section. Version set to 1.0.0, ratified 2026-03-26. All placeholders resolved; no bracket tokens remain.

## Outcome

- ✅ Impact: Constitution v1.0.0 created; all project principles, tech stack, and governance rules are now codified
- 🧪 Tests: none (constitution document — no executable tests)
- 📁 Files: .specify/memory/constitution.md (written), history/prompts/constitution/001-initial-project-constitution.constitution.prompt.md (this file)
- 🔁 Next prompts: /sp.specify <feature-name> to begin Phase 1 feature specs
- 🧠 Reflection: User provided complete, well-structured input; all values were derivable without clarification questions

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): initial
- Next experiment: run /sp.specify for Phase 1 (textbook + RAG chatbot)

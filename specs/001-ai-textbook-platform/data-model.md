# Data Model: AI-Native Textbook Platform

**Branch**: `001-ai-textbook-platform` | **Date**: 2026-03-26

---

## Storage Systems

| Store | What lives here |
|-------|----------------|
| `content/chapters/` (filesystem) | Chapter Markdown files (source of truth for text) |
| Qdrant Cloud | Vector embeddings + chunk metadata |
| Neon (PostgreSQL) | Users, sessions (managed by Better-Auth) |
| Client localStorage | Cached Urdu translations |

---

## 1. Filesystem — Chapter Content

### Directory Layout

```text
content/chapters/<chapter-id>/
├── meta.json
├── beginner.md
├── intermediate.md
└── advanced.md
```

### `meta.json` Schema

```json
{
  "id": "01-intro-to-physical-ai",
  "title": "Introduction to Physical AI",
  "order": 1,
  "readingTimeMinutes": 6,
  "description": "What Physical AI is and why it matters."
}
```

**Validation rules**:
- `id`: kebab-case string, must match directory name
- `order`: integer 1–8, unique across all chapters
- `readingTimeMinutes`: integer 1–10
- All three Markdown variants MUST exist before ingestion

---

## 2. Qdrant — Vector Store

### Collection: `textbook_chunks`

**Vector config**: size=384 (all-MiniLM-L6-v2), distance=Cosine

### Point Schema

```json
{
  "id": "<uuid>",
  "vector": [0.123, ...],
  "payload": {
    "chunk_text":       "The servo motor receives a pulse-width...",
    "chapter_id":       "01-intro-to-physical-ai",
    "chapter_title":    "Introduction to Physical AI",
    "section_heading":  "Actuators and Motion",
    "level":            "intermediate",
    "chunk_index":      3,
    "token_count":      412
  }
}
```

**Filtering**: RAG queries do NOT filter by level (intermediate chunks provide
the best general vocabulary). Level filtering is only applied on chapter page render.

**Indexing strategy**:
- All three level variants are indexed
- `chapter_id` payload field is indexed for potential filtered retrieval
- One-time ingestion via `backend/scripts/ingest.js`; re-run when content changes

---

## 3. PostgreSQL (Neon) — User Data

### Tables (managed by Better-Auth)

#### `user`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, default gen_random_uuid() | |
| email | VARCHAR(255) | UNIQUE, NOT NULL | |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt, never logged |
| level | VARCHAR(20) | DEFAULT 'intermediate' | beginner \| intermediate \| advanced |
| email_verified | BOOLEAN | DEFAULT false | future use |
| created_at | TIMESTAMPTZ | DEFAULT now() | |
| updated_at | TIMESTAMPTZ | DEFAULT now() | auto-updated |

#### `session`

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK | |
| user_id | UUID | FK → user.id ON DELETE CASCADE | |
| token | VARCHAR(255) | UNIQUE, NOT NULL | opaque session token |
| expires_at | TIMESTAMPTZ | NOT NULL | now() + 7 days |
| created_at | TIMESTAMPTZ | DEFAULT now() | |

**Index**: `session(token)` — looked up on every authenticated request.
**Index**: `session(user_id)` — for logout (delete all sessions).

### Migration

Better-Auth generates and runs migrations automatically via `better-auth migrate`
CLI command. The `level` column is added via a custom migration after initial setup.

---

## 4. Client localStorage — Translation Cache

### Key Format

```
translation_{chapter_id}_{level}
```

### Value Schema

```json
{
  "chapter_id": "01-intro-to-physical-ai",
  "level": "intermediate",
  "translated_at": "2026-03-26T10:00:00Z",
  "content": "# فزیکل اے آئی کا تعارف\n..."
}
```

**Cache invalidation**: None required for MVP — content changes are infrequent.
If content is updated, users can clear cache manually (or a version hash can be
added in a future iteration).

---

## 5. Static Content — Quizzes & Summaries (Phase 3)

Stored as static JSON files committed to the repo, served by the backend.

### Path: `content/quizzes/<chapter-id>.quiz.json`

```json
{
  "chapter_id": "01-intro-to-physical-ai",
  "questions": [
    {
      "id": "q1",
      "question": "What is the primary difference between a traditional robot and a Physical AI system?",
      "options": {
        "A": "Traditional robots use electricity; Physical AI does not",
        "B": "Physical AI systems learn from sensory experience and adapt; traditional robots follow fixed programs",
        "C": "Physical AI is only used in factories",
        "D": "There is no difference"
      },
      "correct": "B",
      "explanation": "Physical AI systems are distinguished by their ability to learn from physical interaction and adapt their behavior, unlike traditional robots that execute predefined programs."
    }
  ]
}
```

### Path: `content/summaries/<chapter-id>.summary.json`

```json
{
  "chapter_id": "01-intro-to-physical-ai",
  "points": [
    "Physical AI refers to systems that perceive, learn from, and act in the physical world.",
    "Unlike software-only AI, Physical AI must handle real-world uncertainty: friction, weight, and unpredictable environments.",
    "Humanoid robots are the most complex form of Physical AI, requiring coordination of dozens of joints and sensors.",
    "Key enabling technologies include sensor fusion, reinforcement learning, and real-time control systems.",
    "Physical AI is accelerating toward general-purpose robots capable of human-like dexterity."
  ]
}
```

---

## 6. Entity Relationships

```
content/chapters/<id>/  ──────────────────────────────────┐
  meta.json                                                │
  beginner.md         ─── ingest.js ──► Qdrant chunks     │
  intermediate.md                                          │
  advanced.md                                              │
                                                           │
User (Neon)                                               │
  id ◄──── Session.user_id                                │
  email                                                    │
  level ────────────────────────────────────────────────► chapter fetch (?level=)
  password_hash                                            │
                                                           │
ChatMessage (in-memory, not persisted MVP)                │
  question                                                 │
  retrieved_chunks ◄──── Qdrant search                   │
  response                                                 │
  citation ◄──── chunk payload                            │
                                                           │
localStorage                                               │
  translation_{id}_{level} ◄───── POST /api/translate ───┘
```

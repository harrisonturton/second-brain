# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

A knowledge management and exploration tool ("second brain") that takes a concept query, generates multi-level explanations via LLM, extracts related concepts, finds sources, and visualizes the resulting concept graph. Results are cached in PostgreSQL so repeated queries are fast.

## Commands

### Frontend (`app/`)
```bash
npm run dev      # Start Next.js dev server with Turbopack (localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

### Backend (`server/`)
```bash
go run cmd/main.go    # Start Go server (localhost:8081)
```

### Database (`server/internal/db/`)
```bash
./init_db.sh      # Initialize PostgreSQL database
./drop_db.sh      # Drop the database
sqlc generate     # Regenerate type-safe SQL code after schema changes
```

## Architecture

**Stack:** Next.js 15 + React 19 (TypeScript, Tailwind CSS 4, DaisyUI 5) frontend; Go 1.23 backend; PostgreSQL with SQLC.

### Backend layers (`server/internal/`)

- **`handlers/`** — HTTP endpoints. `/search?query=X&sessionId=Y` is the main entry point.
- **`service/`** — Orchestrates search: checks DB cache, calls engine if missing, builds concept graph, tracks session history.
- **`engine/`** — LLM orchestration. `llm_engine.go` fans out 11 prompt groups (What, Why, Examples, Analogies, When, Where, Who, How, Up, Across, Down), then for each result:
  - `abstract/` generates 5-level abstracts (primary school → professor)
  - `concept/` extracts related concept names
  - `reference/` finds source URLs for each claim
  - `model/` wraps the OpenAI API (supports both `o1` reasoning and `gpt-4o` chat models)
- **`repository/`** — Thin wrapper over SQLC-generated queries.
- **`db/`** — PostgreSQL schema + SQLC config. Tables: `sessions`, `queries`, `concepts`, `concept_names`, `abstracts`, `claims`, `sources`.

### Frontend (`app/app/`)

- **`/` (home)** — Landing page with search input.
- **`/search`** — Main UI. Receives search response from `sessionStorage`, renders panels for abstract, sources, concept menu, and graph.
- **`/chat`** — Streaming content display.

Key components: `AbstractCard` (shows abstract at selected complexity), `SourcesList`, `ConceptsMenu` (related concepts navigation), `GraphModal` (Cytoscape.js concept graph visualization).

API client at `app/api/endpoints/search.ts` uses Axios to call the Go backend.

### Data flow

```
User query → GET /search → Service checks DB cache
  → cache miss: LLMEngine runs 11 prompts concurrently → stores results in DB
  → cache hit: loads from DB
  → builds ConceptGraph (adjacency list) → returns JSON

Frontend stores response in sessionStorage → renders AbstractCard + SourcesList + ConceptsMenu + GraphModal
```

### Key data structures

```typescript
// Core entities
Concept { Id, Name, Description, Abstracts, RelatedConcepts }
Abstract { Claims, Complexity }  // complexity: "primary school" | ... | "professor"
Claim { Body, Source }
ConceptGraph { Nodes: Concept[], AdjList: Concept[][] }
```

## Environment

The Go server expects `OPENAI_API_KEY` and a running PostgreSQL instance. The frontend dev server proxies to `localhost:8081`.

CREATE TABLE sessions
(
    session_id    TEXT PRIMARY KEY,
    query_ids     TEXT[] NOT NULL,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE queries
(
    query_id    TEXT PRIMARY KEY,
    concept_ids  TEXT[] NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE concepts
(
    concept_id    TEXT PRIMARY KEY,
    concept_name  TEXT NOT NULL,
    abstract_ids  TEXT[],
    related_concept_ids TEXT[],
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE concept_names
(
    id TEXT PRIMARY KEY,
    concept_name  TEXT NOT NULL,
    concept_id    TEXT NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE abstracts
(
    abstract_id TEXT PRIMARY KEY,
    complexity TEXT NOT NULL,
    claim_ids TEXT[] NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE claims
(
    claim_id TEXT PRIMARY KEY,
    claim TEXT NOT NULL,
    abstract_id TEXT NOT NULL,
    source_id TEXT NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sources
(
    source_id TEXT PRIMARY KEY,
    source_name TEXT NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
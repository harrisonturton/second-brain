-- name: CreateSession :one
INSERT INTO sessions (session_id, query_ids)
VALUES ($1, $2) 
RETURNING *;

-- name: GetSession :one
SELECT * FROM sessions
WHERE session_id = $1;

-- name: UpdateSessionQueries :one
UPDATE sessions 
SET query_ids = $2
WHERE session_id = $1
RETURNING *;

-- name: AppendQueryToSession :one
UPDATE sessions 
SET query_ids = array_append(query_ids, $2)
WHERE session_id = $1
RETURNING *;

-- name: CreateQuery :one
INSERT INTO queries (query_id, concept_ids)
VALUES ($1, $2)
RETURNING *;

-- name: GetQuery :one
SELECT * FROM queries
WHERE query_id = $1;

-- name: CreateConcept :one
INSERT INTO concepts (concept_id, concept_name, abstract_ids, related_concept_ids)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: CreateConceptName :one
INSERT INTO concept_names (id, concept_name, concept_id)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetConcept :one
SELECT * FROM concepts
WHERE concept_id = $1;

-- name: GetConceptIdsByName :many
SELECT concept_id 
FROM concept_names
WHERE concept_name = $1;

-- name: UpdateConceptRelatedConcepts :one
UPDATE concepts
SET related_concept_ids = $2
WHERE concept_id = $1
    RETURNING *;

-- name: UpdateConceptAbstracts :one
UPDATE concepts
SET abstract_ids = $2
WHERE concept_id = $1
    RETURNING *;

-- name: CreateAbstract :one
INSERT INTO abstracts (abstract_id, complexity, claim_ids)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetAbstract :one
SELECT * FROM abstracts
WHERE abstract_id = $1;

-- name: CreateClaim :one
INSERT INTO claims (claim_id, claim, abstract_id, source_id)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetClaim :one
SELECT * FROM claims
WHERE claim_id = $1;

-- name: CreateSource :one
INSERT INTO sources (source_id, source_name)
VALUES ($1, $2)
RETURNING *;

-- name: GetSource :one
SELECT * FROM sources
WHERE source_id = $1;
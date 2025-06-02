package repository

import (
	"context"
	db "github.com/liappi/second-brain/server/internal/db/generated"
)

type Repository struct {
	queries *db.Queries // sqlc-generated queries
}

// New initializes a new Repository
func New(queries *db.Queries) *Repository {
	return &Repository{queries: queries}
}

// AppendQueryToSession appends a query to a session
func (r *Repository) AppendQueryToSession(ctx context.Context, sessionID string, queryID string) error {
	_, err := r.queries.AppendQueryToSession(ctx, db.AppendQueryToSessionParams{
		SessionID:   sessionID,
		ArrayAppend: queryID,
	})
	return err
}

// CreateAbstract creates an abstract
func (r *Repository) CreateAbstract(
	ctx context.Context,
	abstractID string,
	complexity string,
	claimIDs []string,
) error {
	_, err := r.queries.CreateAbstract(ctx, db.CreateAbstractParams{
		AbstractID: abstractID,
		Complexity: complexity,
		ClaimIds:   claimIDs,
	})
	return err
}

// CreateClaim creates a claim
func (r *Repository) CreateClaim(ctx context.Context, claimID string, claim string, abstractID string, sourceID string) error {
	_, err := r.queries.CreateClaim(ctx, db.CreateClaimParams{
		ClaimID:    claimID,
		Claim:      claim,
		AbstractID: abstractID,
		SourceID:   sourceID,
	})
	return err
}

// CreateConcept creates a concept
func (r *Repository) CreateConcept(ctx context.Context, conceptID string, name string, abstractIds []string) error {
	_, err := r.queries.CreateConcept(ctx, db.CreateConceptParams{
		ConceptID:   conceptID,
		ConceptName: name,
		AbstractIds: abstractIds,
	})
	return err
}

// CreateConceptName creates a concept name
func (r *Repository) CreateConceptName(ctx context.Context, id string, conceptID string, name string) error {
	_, err := r.queries.CreateConceptName(ctx, db.CreateConceptNameParams{
		ID:          id,
		ConceptName: name,
		ConceptID:   conceptID,
	})
	return err
}

// CreateQuery creates a query
func (r *Repository) CreateQuery(ctx context.Context, queryID string, conceptIds []string) error {
	_, err := r.queries.CreateQuery(ctx, db.CreateQueryParams{
		QueryID:    queryID,
		ConceptIds: conceptIds,
	})
	return err
}

// CreateSession creates a session
func (r *Repository) CreateSession(ctx context.Context, sessionID string, queryIDs []string) error {
	_, err := r.queries.CreateSession(ctx, db.CreateSessionParams{
		SessionID: sessionID,
		QueryIds:  queryIDs,
	})
	return err
}

// CreateSource creates a source
func (r *Repository) CreateSource(ctx context.Context, sourceID string, name string) error {
	_, err := r.queries.CreateSource(ctx, db.CreateSourceParams{
		SourceID:   sourceID,
		SourceName: name,
	})
	return err
}

// GetAbstract retrieves an abstract
func (r *Repository) GetAbstract(ctx context.Context, abstractID string) (db.Abstract, error) {
	return r.queries.GetAbstract(ctx, abstractID)
}

// GetClaim retrieves a claim
func (r *Repository) GetClaim(ctx context.Context, claimID string) (db.Claim, error) {
	return r.queries.GetClaim(ctx, claimID)
}

// GetConcept retrieves a concept
func (r *Repository) GetConcept(ctx context.Context, conceptID string) (db.Concept, error) {
	return r.queries.GetConcept(ctx, conceptID)
}

// GetConceptIdsByName retrieves concept ids by name
func (r *Repository) GetConceptIdsByName(ctx context.Context, name string) ([]string, error) {
	return r.queries.GetConceptIdsByName(ctx, name)
}

// GetSession retrieves a session
func (r *Repository) GetSession(ctx context.Context, sessionID string) (db.Session, error) {
	return r.queries.GetSession(ctx, sessionID)
}

// GetQuery retrieves a query
func (r *Repository) GetQuery(ctx context.Context, queryID string) (db.Query, error) {
	return r.queries.GetQuery(ctx, queryID)
}

// GetSource retrieves a source
func (r *Repository) GetSource(ctx context.Context, sourceID string) (db.Source, error) {
	return r.queries.GetSource(ctx, sourceID)
}

// UpdateConceptAbstracts updates a concept's abstracts
func (r *Repository) UpdateConceptAbstracts(ctx context.Context, conceptID string, abstractIDs []string) error {
	_, err := r.queries.UpdateConceptAbstracts(ctx, db.UpdateConceptAbstractsParams{
		ConceptID:   conceptID,
		AbstractIds: abstractIDs,
	})
	return err
}

// UpdateConceptRelatedConcepts updates a concept's related concepts
func (r *Repository) UpdateConceptRelatedConcepts(ctx context.Context, conceptID string, relatedConceptIDs []string) error {
	_, err := r.queries.UpdateConceptRelatedConcepts(ctx, db.UpdateConceptRelatedConceptsParams{
		ConceptID:         conceptID,
		RelatedConceptIds: relatedConceptIDs,
	})
	return err
}

// UpdateSessionQueries updates a session's queries
func (r *Repository) UpdateSessionQueries(ctx context.Context, sessionID string, queryIDs []string) error {
	_, err := r.queries.UpdateSessionQueries(ctx, db.UpdateSessionQueriesParams{
		SessionID: sessionID,
		QueryIds:  queryIDs,
	})
	return err
}

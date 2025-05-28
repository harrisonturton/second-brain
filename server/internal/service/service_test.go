package service

import (
	"context"
	"database/sql"
	db2 "github.com/liappi/second-brain/server/internal/db"
	"testing"

	"github.com/liappi/second-brain/server/internal/engine"

	db "github.com/liappi/second-brain/server/internal/db/generated"
	"github.com/liappi/second-brain/server/internal/repository"
	"github.com/stretchr/testify/assert"
)

func TestService_Search(t *testing.T) {
	tests := map[string][]Request{
		"car": {
			{
				SessionId: "",
				Query:     "car",
			},
			{
				SessionId: "sessionId",
				Query:     "suv",
			},
		},
	}

	// initialize db
	err := db2.DestroyDb()
	if err != nil {
		t.Fatal()
	}
	err = db2.InitDb()
	if err != nil {
		t.Fatal()
	}

	dbConn, _ := sql.Open("postgres", "postgres://postgres:postgres@localhost:5432/second_brain?sslmode=disable")
	queries := db.New(dbConn)
	repo := repository.New(queries)
	eng := engine.NewFakeEngine()
	svc := New(repo, eng)

	ctx := context.Background()

	for tc, req := range tests {
		t.Run(tc, func(t *testing.T) {
			// first query term
			res1, err := svc.Search(ctx, req[0])
			assert.NoError(t, err)
			assert.NotEmpty(t, res1.Concept)
			assert.NotEmpty(t, res1.ConceptGraph)
			assert.NotEmpty(t, res1.History)

			// first query term again
			res2, err := svc.Search(ctx, req[0])
			assert.NoError(t, err)
			assert.NotEmpty(t, res2.Concept)
			assert.NotEmpty(t, res2.ConceptGraph)
			assert.NotEmpty(t, res2.History)

			// related query term
			res3, err := svc.Search(ctx, req[1])
			assert.NoError(t, err)
			assert.NotEmpty(t, res3.Concept)
			assert.NotEmpty(t, res3.ConceptGraph)
			assert.NotEmpty(t, res3.History)

			// related query term again
			res4, err := svc.Search(ctx, req[1])
			assert.NoError(t, err)
			assert.NotEmpty(t, res4.Concept)
			assert.NotEmpty(t, res4.ConceptGraph)
			assert.NotEmpty(t, res4.History)
		})
	}
}

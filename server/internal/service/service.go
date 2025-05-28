package service

import (
	"context"
	"fmt"
	"net/url"
	"strconv"

	db "github.com/liappi/second-brain/server/internal/db/generated"

	"github.com/google/uuid"
	"github.com/liappi/second-brain/server/internal/engine"
	"github.com/liappi/second-brain/server/internal/engine/concept"
	"github.com/liappi/second-brain/server/internal/repository"
)

type Service struct {
	repo   *repository.Repository
	engine engine.Engine
}

// New initializes a new Service
func New(repo *repository.Repository, engine engine.Engine) *Service {
	return &Service{
		repo:   repo,
		engine: engine,
	}
}

func (s *Service) Search(ctx context.Context, req Request) (Response, error) {
	// if no session id, create a new session
	sessionId := req.SessionId
	if req.SessionId == "" {
		//sessionId = uuid.NewString()
		sessionId = "sessionId"
		err := s.repo.CreateSession(ctx, sessionId, make([]string, 0))
		if err != nil {
			return Response{}, fmt.Errorf("failed to create session: %v", err)
		}
	}

	// assume query maps to 1 concept
	conceptName := req.Query
	conceptIds, err := s.repo.GetConceptIdsByName(ctx, conceptName)
	if err != nil {
		return Response{}, fmt.Errorf("failed to get concept ids: %v", err)
	}

	var c Concept
	if len(conceptIds) == 0 { // current concept doesn't exist
		ea, cg, err := s.engine.GenerateEnhancedAbstracts(conceptName)
		if err != nil {
			return Response{}, fmt.Errorf("failed to generate abstracts: %v", err)
		}
		c, err = mapEngineOutputToConcept(conceptName, ea)
		if err != nil {
			return Response{}, fmt.Errorf("failed to map engine output: %v", err)
		}
		//c.Id = uuid.NewString()
		c, err = s.createConcept(ctx, c, cg)
		if err != nil {
			return Response{}, fmt.Errorf("failed to create concept: %v", err)
		}
	} else { // current concept exists
		conceptId := conceptIds[0]
		dbC, err := s.repo.GetConcept(ctx, conceptId)
		if err != nil {
			return Response{}, fmt.Errorf("failed to get concept: %v", err)
		}

		if len(dbC.AbstractIds) == 0 { // current concept not populated
			ea, cg, err := s.engine.GenerateEnhancedAbstracts(conceptName)
			if err != nil {
				return Response{}, fmt.Errorf("failed to generate abstracts: %v", err)
			}
			c, err = mapEngineOutputToConcept(conceptName, ea)
			if err != nil {
				return Response{}, fmt.Errorf("failed to map engine output: %v", err)
			}
			err = s.updateConcept(ctx, c, cg)
			if err != nil {
				return Response{}, fmt.Errorf("failed to update concept: %v", err)
			}
		} else {
			c, err = s.buildConcept(ctx, dbC)
			if err != nil {
				return Response{}, fmt.Errorf("failed to build concept: %v", err)
			}
		}
	}

	err = s.updateHistory(ctx, c.Id, sessionId)
	if err != nil {
		return Response{}, fmt.Errorf("failed to update history: %v", err)
	}
	history, err := s.getHistory(ctx, sessionId)
	if err != nil {
		return Response{}, fmt.Errorf("failed to get history: %v", err)
	}
	conceptGraph, err := s.buildConceptGraph(ctx, history)
	if err != nil {
		return Response{}, fmt.Errorf("failed to build concept graph: %v", err)
	}

	return Response{
		SessionId:    sessionId,
		Concept:      c,
		ConceptGraph: conceptGraph,
		History:      history,
	}, nil
}

func (s *Service) updateHistory(ctx context.Context, conceptId string, sessionId string) error {
	queryId := uuid.NewString()
	err := s.repo.CreateQuery(ctx, queryId, []string{conceptId})
	if err != nil {
		return fmt.Errorf("failed to create query")
	}
	err = s.repo.AppendQueryToSession(ctx, sessionId, queryId)
	if err != nil {
		return fmt.Errorf("failed to update session: %v", err)
	}
	return nil
}

func (s *Service) createConceptAbstracts(ctx context.Context, c Concept) ([]string, error) {
	abstractIds := make([]string, 0)
	for _, a := range c.Abstracts {
		abstractId := uuid.NewString()
		claimIds := make([]string, 0)
		for _, cl := range a.Claims {
			claimId := uuid.NewString()
			sourceId := uuid.NewString()
			err := s.repo.CreateSource(ctx, sourceId, cl.Source.Link)
			if err != nil {
				return nil, fmt.Errorf("failed to create source")
			}
			err = s.repo.CreateClaim(ctx, claimId, cl.Body, abstractId, sourceId)
			if err != nil {
				return nil, fmt.Errorf("failed to create claim")
			}
			claimIds = append(claimIds, claimId)
		}
		err := s.repo.CreateAbstract(ctx, abstractId, a.Complexity, claimIds)
		if err != nil {
			return nil, fmt.Errorf("failed to create abstract")
		}
		abstractIds = append(abstractIds, abstractId)
	}
	return abstractIds, nil
}

func (s *Service) createRelatedConcepts(ctx context.Context, conceptGroups []concept.ConceptGroup) ([]string, error) {
	relatedConceptIds := make([]string, 0)
	for _, cg := range conceptGroups {
		for _, cn := range cg.Concepts {
			cids, err := s.repo.GetConceptIdsByName(ctx, cn)
			if err != nil {
				return nil, fmt.Errorf("failed to get concept ids")
			}
			if len(cids) == 0 { // related concept doesn't exist yet
				cid := uuid.NewString()
				err = s.repo.CreateConcept(ctx, cid, cn, make([]string, 0))
				if err != nil {
					return nil, fmt.Errorf("failed to create concept")
				}
				relatedConceptIds = append(relatedConceptIds, cid)
			} else {
				cid := cids[0]
				relatedConceptIds = append(relatedConceptIds, cid)
			}
		}
	}
	return relatedConceptIds, nil
}

func (s *Service) createConcept(ctx context.Context, c Concept, conceptGroups []concept.ConceptGroup) (Concept, error) {
	abstractIds, err := s.createConceptAbstracts(ctx, c)
	if err != nil {
		return Concept{}, fmt.Errorf("failed to create concept abstracts: %v", err)
	}
	conceptId := uuid.NewString()
	err = s.repo.CreateConcept(ctx, conceptId, c.Name, abstractIds)
	if err != nil {
		return Concept{}, fmt.Errorf("failed to create concept: %v", err)
	}
	c.Id = conceptId
	err = s.repo.CreateConceptName(ctx, conceptId, c.Name)
	if err != nil {
		return Concept{}, fmt.Errorf("failed to create concept name: %v", err)
	}
	relatedConceptIds, err := s.createRelatedConcepts(ctx, conceptGroups)
	if err != nil {
		return Concept{}, fmt.Errorf("failed to create related concepts: %v", err)
	}
	err = s.repo.UpdateConceptRelatedConcepts(ctx, conceptId, relatedConceptIds)
	if err != nil {
		return Concept{}, fmt.Errorf("failed to update concept related concepts: %v", err)
	}
	return c, nil
}

func (s *Service) updateConcept(ctx context.Context, c Concept, cg []concept.ConceptGroup) error {
	abstractIds, err := s.createConceptAbstracts(ctx, c)
	if err != nil {
		return fmt.Errorf("failed to create concept abstracts: %v", err)
	}
	err = s.repo.UpdateConceptAbstracts(ctx, c.Id, abstractIds)
	if err != nil {
		return fmt.Errorf("failed to update concept abstracts: %v", err)
	}
	relatedConceptIds, err := s.createRelatedConcepts(ctx, cg)
	if err != nil {
		return fmt.Errorf("failed to create related concepts: %v", err)
	}
	err = s.repo.UpdateConceptRelatedConcepts(ctx, c.Id, relatedConceptIds)
	if err != nil {
		return fmt.Errorf("failed to update concept related concepts: %v", err)
	}
	return nil
}

func (s *Service) getHistory(ctx context.Context, sessionId string) ([]Concept, error) {
	session, err := s.repo.GetSession(ctx, sessionId)
	if err != nil {
		return nil, fmt.Errorf("failed to get session: %v", err)
	}
	concepts := make([]Concept, 0)
	for _, id := range session.QueryIds {
		query, err := s.repo.GetQuery(ctx, id)
		if err != nil {
			return nil, fmt.Errorf("failed to get query: %v", err)
		}
		for _, conceptId := range query.ConceptIds {
			c, err := s.repo.GetConcept(ctx, conceptId)
			if err != nil {
				return nil, fmt.Errorf("failed to get concept: %v", err)
			}
			concepts = append(concepts, Concept{
				Id:          conceptId,
				Name:        c.ConceptName,
				Description: c.ConceptName,
				Abstracts:   nil,
			})
		}
	}
	return concepts, nil
}

func (s *Service) buildConceptGraph(ctx context.Context, concepts []Concept) (ConceptGraph, error) {
	adjList := make([][]Concept, len(concepts))
	for i, c := range concepts {
		if adjList[i] == nil {
			adjList[i] = make([]Concept, 0)
		}
		dbConcept, err := s.repo.GetConcept(ctx, c.Id)
		if err != nil {
			return ConceptGraph{}, fmt.Errorf("failed to get concept: %v", err)
		}
		for _, rid := range dbConcept.RelatedConceptIds {
			rc, err := s.repo.GetConcept(ctx, rid)
			if err != nil {
				return ConceptGraph{}, fmt.Errorf("failed to get related concept: %v", err)
			}
			adjList[i] = append(adjList[i], Concept{
				Id:          rc.ConceptID,
				Name:        rc.ConceptName,
				Description: rc.ConceptName,
				Abstracts:   nil, // don't need to populate this since it's only used for the graph visualisation
			})
		}
	}
	return ConceptGraph{
		Nodes:   concepts,
		AdjList: adjList,
	}, nil
}

func (s *Service) buildConcept(ctx context.Context, c db.Concept) (Concept, error) {
	abstracts := make([]Abstract, 0)
	for i, abstractId := range c.AbstractIds {
		abstract, err := s.repo.GetAbstract(ctx, abstractId)
		if err != nil {
			return Concept{}, fmt.Errorf("failed to get abstract: %v", err)
		}
		claims := make([]Claim, 0)
		for _, claimId := range abstract.ClaimIds {
			claim, err := s.repo.GetClaim(ctx, claimId)
			if err != nil {
				return Concept{}, fmt.Errorf("failed to get claim: %v", err)
			}
			source, err := s.repo.GetSource(ctx, claim.SourceID)
			if err != nil {
				return Concept{}, fmt.Errorf("failed to get source: %v", err)
			}
			titleUrl, err := url.Parse(source.SourceName)
			if err != nil {
				return Concept{}, fmt.Errorf("failed to parse source URL: %v", err)
			}
			mappedClaim := Claim{
				Body: claim.Claim,
				Source: Source{
					Title:   titleUrl.String(),
					Link:    source.SourceName,
					Preview: "<some preview>",
				},
			}
			claims = append(claims, mappedClaim)
		}
		a := Abstract{
			Claims:     claims,
			Complexity: strconv.Itoa(i),
		}
		abstracts = append(abstracts, a)
	}

	return Concept{
		Id:          c.ConceptID,
		Name:        c.ConceptName,
		Description: c.ConceptName,
		Abstracts:   abstracts,
	}, nil
}

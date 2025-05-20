package service

import (
	"context"
	"fmt"
	"net/url"
	"strconv"

	"github.com/google/uuid"
	"github.com/liappi/second-brain/server/internal/engine"
	"github.com/liappi/second-brain/server/internal/engine/concept"
	"github.com/liappi/second-brain/server/internal/repository"
)

// Service provides business logic for users
type Service struct {
	repo *repository.Repository
	//engine *engine.Engine
}

// NewService initializes a new Service
func NewService(repo *repository.Repository) *Service {
	return &Service{repo: repo}
}

// Result represents an engine result
type Result struct {
	Concept       Concept
	ConceptGroups []concept.ConceptGroup
}

func (s *Service) Search(ctx context.Context, req Request) (Response, error) {
	// if no session id, create a new session
	var sessionId string
	if req.SessionId == "" {
		sessionId = uuid.NewString()
	}

	// assume query maps to 1 concept
	conceptName := req.Query
	conceptIds, err := s.repo.GetConceptIdsByName(ctx, conceptName)
	if err != nil {
		return Response{}, fmt.Errorf("failed to get concept ids: %v", err)
	}

	var res Result
	if len(conceptIds) == 0 {
		// generate abstracts for new concept
		res, err = s.callEngine(ctx, conceptName)
		if err != nil {
			return Response{}, fmt.Errorf("failed to call engine: %v", err)
		}
		err = s.saveToRepo(ctx, res)
		if err != nil {
			return Response{}, fmt.Errorf("failed to save to repo: %v", err)
		}
	} else {
		// retrieve existing concept
		res, err = s.callRepo(ctx, conceptIds[0])
		// if abstracts not populated, call engine, save result
		if err != nil {
			return Response{}, fmt.Errorf("failed to fetch from repo: %v", err)
		}
	}
	// build concept from engine/repo response

	// populate session with latest query
	_ = s.repo.AppendQueryToSession(ctx, sessionId, "queryId") // TODO

	// get session history (concepts slice)
	// build concept graph from history

	return Response{SessionId: sessionId}, nil
}

func (s *Service) getHistory(ctx context.Context, sessionId string) ([]Concept, error) {
	session, _ := s.repo.GetSession(ctx, sessionId)
	for i, id := range session.QueryIds {
		// get query by queryId
		// get concepts by conceptId
		// map to Concepts slice
	}

	return nil, nil
}

func (s *Service) mapConceptGraph(ctx context.Context, concepts []Concept) (ConceptGraph, error) {
	adjList := make([][]Concept, len(concepts))
	for i, concept := range concepts {
		if adjList[i] == nil {
			adjList[i] = make([]Concept, 0)
		}
		c, _ := s.repo.GetConcept(ctx, concept.Id)
		for j, rid := range c.RelatedConceptIds {
			rc, _ := s.repo.GetConcept(ctx, rid)
			adjList[i] = append(adjList[i], Concept{
				Id:          rc.ConceptID,
				Name:        rc.ConceptName,
				Description: rc.ConceptName,
				Abstracts:   nil, // TODO: not sure if we need to populate
			})
		}
	}

	return ConceptGraph{
		Nodes:   concepts,
		AdjList: adjList,
	}, nil
}

// assumes concept already populated
func (s *Service) callRepo(ctx context.Context, conceptId string) (Result, error) {
	// map concept
	c, err := s.repo.GetConcept(ctx, conceptId)
	if err != nil {
		return Result{}, fmt.Errorf("failed to get concept: %v", err)
	}
	abstracts := make([]Abstract, 0)
	for i, abstractId := range c.AbstractIds {
		abstract, err := s.repo.GetAbstract(ctx, abstractId)
		if err != nil {
			return Result{}, fmt.Errorf("failed to get abstract: %v", err)
		}
		claims := make([]Claim, 0)
		for _, claimId := range abstract.ClaimIds {
			claim, err := s.repo.GetClaim(ctx, claimId)
			if err != nil {
				return Result{}, fmt.Errorf("failed to get claim: %v", err)
			}
			source, err := s.repo.GetSource(ctx, claim.SourceID)
			println(source)
			if err != nil {
				return Result{}, fmt.Errorf("failed to get source: %v", err)
			}
			titleUrl, _ := url.Parse(source.SourceName)
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

	// map related concepts
	mappedC := Concept{
		Id:          conceptId,
		Name:        c.ConceptName,
		Description: c.ConceptName,
		Abstracts:   abstracts,
	}
	conceptGroups := make([]concept.ConceptGroup, 0)
	for _, id := range c.RelatedConceptIds {
		rc, _ := s.repo.GetConcept(ctx, id)
		cg := concept.ConceptGroup{
			Name:        rc.ConceptName,
			Description: rc.ConceptName,
			Concepts:    nil,
		}
		conceptGroups = append(conceptGroups, cg)
	}

	return Result{
		Concept:       mappedC,
		ConceptGroups: conceptGroups,
	}, nil
}

func (s *Service) callEngine(ctx context.Context, conceptName string) (Result, error) {
	enhancedAbstracts, conceptGroups, err := engine.GenerateEnhancedAbstracts(conceptName)
	if err != nil {
		return Result{}, fmt.Errorf("failed to generate enhanced abstracts: %v", err)
	}

	// map engine response
	c := Concept{
		Name:        conceptName,
		Description: enhancedAbstracts[0].Abstract[0],
		Abstracts:   make([]Abstract, 0),
	}
	for i, ea := range enhancedAbstracts {
		abstract := Abstract{
			Claims:     make([]Claim, 0),
			Complexity: strconv.Itoa(i),
		}
		for j, _ := range ea.Abstract {
			titleUrl, _ := url.Parse(ea.References[j])
			abstract.Claims = append(abstract.Claims, Claim{
				Body: ea.Abstract[j],
				Source: Source{
					Title:   titleUrl.Path,
					Link:    ea.References[j],
					Preview: "<some preview>",
				},
			})
		}
		c.Abstracts = append(c.Abstracts, abstract)
	}

	return Result{
		Concept:       c,
		ConceptGroups: conceptGroups,
	}, nil
}

// completely new concept
func (s *Service) saveToRepo(ctx context.Context, result Result) error {
	// new concept
	abstractIds := make([]string, 0)
	for i, a := range result.Concept.Abstracts {
		abstractId := uuid.NewString()
		claimIds := make([]string, 0)
		for j, c := range a.Claims {
			claimId := uuid.NewString()
			sourceId := uuid.NewString()
			_ = s.repo.CreateSource(ctx, sourceId, c.Source.Link)
			_ = s.repo.CreateClaim(ctx, claimId, abstractId, sourceId)
			// TODO: with claim text
			claimIds = append(claimIds, claimId)
		}
		_ = s.repo.CreateAbstract(ctx, abstractId, a.Complexity, claimIds)
		abstractIds = append(abstractIds, abstractId)
	}
	conceptId := uuid.NewString()
	_ = s.repo.CreateConcept(ctx, conceptId, result.Concept.Name, abstractIds)
	_ = s.repo.CreateConceptName(ctx, conceptId, result.Concept.Name)

	for i, cg := range result.ConceptGroups {
		for j, c := range cg.Concepts {
			cid, _ := s.repo.GetConceptIdsByName(ctx, c)
			if len(cid) == 0 {
				// create new concepts for each related concept
				// update current concept with related concepts
			} else {
				// update current concept with related concepts
			}
		}
	}

	// new query
	queryId := uuid.NewString()
	_ = s.repo.CreateQuery(ctx, queryId, []string{conceptId})

	return nil
}

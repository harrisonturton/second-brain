package service

// Request response types matching FE `types.ts` and `search.ts`
// Request represents a search request
type Request struct {
	SessionId string
	Query     string
}

// Response represents a search response
type Response struct {
	SessionId    string
	Concept      Concept
	ConceptGraph ConceptGraph
	History      []Concept
}

type Concept struct {
	Id          string
	Name        string
	Description string
	Abstracts   []Abstract
}

type Abstract struct {
	Claims     []Claim
	Complexity string
}

type Claim struct {
	Body   string
	Source Source
}

type Source struct {
	Title   string
	Link    string
	Preview string
}

type ConceptGraph struct {
	Nodes   []Concept
	AdjList [][]Concept
}

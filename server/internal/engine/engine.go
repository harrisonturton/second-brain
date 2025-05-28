package engine

import "github.com/liappi/second-brain/server/internal/engine/concept"

type EnhancedAbstract struct {
	Abstract   []string
	References []string
}

type Engine interface {
	GenerateEnhancedAbstracts(query string) ([]EnhancedAbstract, []concept.ConceptGroup, error)
}

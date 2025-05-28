package engine

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

// Actually runs everything, so is slow.
func TestGenerateEnhancedAbstracts(t *testing.T) {
	tests := []struct {
		query string
	}{
		{
			query: "car",
		},
	}

	eng := NewLlmEngine()

	for _, tt := range tests {
		t.Run(tt.query, func(t *testing.T) {
			abstracts, conceptGroups, err := eng.GenerateEnhancedAbstracts(tt.query)
			assert.NoError(t, err)

			assert.NotEmptyf(t, abstracts, "No abstracts were generated.")
			for _, a := range abstracts {
				assert.NotEmptyf(t, a.Abstract, "No claims were generated.")
				assert.NotEmptyf(t, a.References, "No references were extracted.")
			}

			assert.NotEmptyf(t, conceptGroups, "No concept groups were generated.")
			for _, cg := range conceptGroups {
				assert.NotEmptyf(t, cg.Concepts, "No concepts were extracted.")
			}
		})
	}
}

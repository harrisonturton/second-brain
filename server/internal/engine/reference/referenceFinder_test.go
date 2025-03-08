package reference

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestFind(t *testing.T) {
	abstractSentences := []string{
		"A car, also known as an automobile, is a wheeled motor vehicle designed primarily for the transportation of people.",
		"Most cars have four wheels and are designed to run primarily on roads.",
		"They typically have seating for one to eight people, depending on the model and design.",
	}

	sources, err := Find(abstractSentences)
	assert.NoError(t, err)

	if len(sources) != len(abstractSentences) {
		t.Errorf("Expected to find one source per claim, got %v instead", sources)
	}
}

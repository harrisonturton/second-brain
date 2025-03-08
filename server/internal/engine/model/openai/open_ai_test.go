package openai

import (
	"github.com/liappi/second-brain/server/internal/engine/model"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestOpenAI(t *testing.T) {
	tests := []struct {
		prompt string
	}{
		{
			prompt: "What is a car?",
		},
	}

	for _, tt := range tests {
		t.Run(tt.prompt, func(t *testing.T) {
			realResponse, err := Call(false, tt.prompt, model.Gpt4o)
			assert.NoError(t, err)
			fakeResponse, err := Call(true, tt.prompt, model.Gpt4o)
			assert.NoError(t, err)

			assert.NotEmptyf(t, realResponse, "Real OpenAI response is empty")
			assert.NotEmptyf(t, fakeResponse, "Fake OpenAI response is empty")
		})
	}
}

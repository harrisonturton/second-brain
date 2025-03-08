package model

import (
	"flag"
	"fmt"
	"github.com/liappi/second-brain/server/internal/engine/model/openai"
)

var fakeMode = flag.Bool("fakeMode", false, "Use fake implementation instead of real")

var (
	reasoningModel = flag.String("reasoningModel", O1, "Use o1 reasoning model")
	chatModel      = flag.String("chatModel", Gpt4o, "Use gpt-4o chat model")
)

const (
	Reasoning PromptType = iota
	Chat
)

type PromptType int

func Call(prompt string, promptType PromptType) (string, error) {
	switch promptType {
	case Reasoning:
		if err := validate(*reasoningModel); err != nil {
			return "", fmt.Errorf("error calling model: %v", err)
		}

		res, err := openai.Call(*fakeMode, prompt, *reasoningModel)
		if err != nil {
			return "", fmt.Errorf("error calling model: %v", err)
		}
		return res, nil
	case Chat:
		if err := validate(*chatModel); err != nil {
			return "", fmt.Errorf("error calling model: %v", err)
		}

		res, err := openai.Call(*fakeMode, prompt, *chatModel)
		if err != nil {
			return "", fmt.Errorf("error calling model: %v", err)
		}
		return res, nil
	}

	return "", fmt.Errorf("error calling model: invalid prompt type: %v", promptType)
}

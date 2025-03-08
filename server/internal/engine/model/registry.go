package model

import "fmt"

const (
	O1    = "o1-preview"
	Gpt4o = "gpt-4o"
)

var modelRegistry = map[string]struct{}{
	O1:    {},
	Gpt4o: {},
}

func validate(model string) error {
	if _, exists := modelRegistry[model]; !exists {
		return fmt.Errorf("invalid model: %v", model)
	}
	return nil
}

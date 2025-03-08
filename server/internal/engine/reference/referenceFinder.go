package reference

import (
	"fmt"
	"github.com/liappi/second-brain/server/internal/engine/model"
	"strings"
	"text/template"
)

var (
	Sources = "Given the following claim, find 1 reputable web source that isn't Wikipedia to support the claim. " +
		"Include the URL only. Ensure the URL is a valid one. \n" +
		"{{.Claim}}"
)

// Find returns a map of web references backing a given abstract, where a sentence is keyed to a web reference
// E.g. "Some sentence about cars." -> "www.cars.com"
func Find(abstractSentences []string) (map[string]string, error) {
	sources := make(map[string]string)
	for _, sentence := range abstractSentences {
		t, _ := template.New("sources").Parse(Sources)
		var promptBuilder strings.Builder
		data := struct {
			Claim string
		}{
			Claim: sentence,
		}
		_ = t.Execute(&promptBuilder, data)
		res, err := model.Call(promptBuilder.String(), model.Chat)
		if err != nil {
			return nil, fmt.Errorf("error finding resources: %v", err)
		}
		sources[sentence] = res
	}
	return sources, nil
}

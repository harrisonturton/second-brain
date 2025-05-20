package reference

import (
	"fmt"
	"strings"
	"text/template"

	"github.com/liappi/second-brain/server/internal/engine/model"
)

var (
	Sources = "Given the following claim, find 1 reputable web source that isn't Wikipedia to support the claim. " +
		"Include the URL only. Ensure the URL is a valid one. \n" +
		"{{.Claim}}"
)

// Reference represents a sentence and its corresponding web reference
type Reference struct {
	Sentence string
	Url      string
}

// Find returns an ordered slice of references backing a given abstract, where each reference contains a sentence and its web reference
// E.g. "Some sentence about cars." -> "www.cars.com"
func Find(abstractSentences []string) ([]Reference, error) {
	var references []Reference
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
		references = append(references, Reference{
			Sentence: sentence,
			Url:      res,
		})
	}
	return references, nil
}

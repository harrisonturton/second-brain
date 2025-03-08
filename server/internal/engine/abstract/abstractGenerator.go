package abstract

import (
	"fmt"
	"github.com/liappi/second-brain/server/internal/engine/model"
	"strings"
	"text/template"
)

var (
	ExpertiseLevels = []string{
		"primary school student",
		"high school student",
		"undergraduate student",
		"PhD student",
		"professor",
	}
	Summary = "Summarize the following into a paragraph, as though you were explaining it to a " +
		"{{.ExpertiseLevel}}: \n{{.Summary}}"
)

// Generate Given a long-form response, generate a map of abstracts written at different levels of complexity where the
// complexity is keyed to an abstract
// E.g. "primary school" (ExpertiseLevels) -> "Some abstract about cars."
func Generate(response string) (map[string]string, error) {
	abstracts := make(map[string]string)
	for _, level := range ExpertiseLevels {
		t, _ := template.New("summary").Parse(Summary)
		var promptBuilder strings.Builder
		data := struct {
			ExpertiseLevel string
			Summary        string
		}{
			ExpertiseLevel: level,
			Summary:        response,
		}
		_ = t.Execute(&promptBuilder, data)
		res, err := model.Call(promptBuilder.String(), model.Chat)
		if err != nil {
			return nil, fmt.Errorf("error generating abstracts: %v", err)
		}

		abstracts[level] = res
	}
	return abstracts, nil
}

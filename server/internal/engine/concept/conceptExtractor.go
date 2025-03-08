package concept

import (
	"fmt"
	"github.com/liappi/second-brain/server/internal/engine/model"
	"strings"
	"text/template"
)

var (
	KeyConcepts = "Given the following summary, provide a comma-delimited list of key points for the information given, " +
		"where each point is 1-2 terms. Use no other punctuation including full stops or capitalisation.\n{{.Summary}}"
)

// A group of related concepts
type ConceptGroup struct {
	Name        string
	Description string
	Concepts    []string
}

// Extract concepts for a given abstract
func Extract(name, description, abstract string) (ConceptGroup, error) {
	t, _ := template.New("keyConcepts").Parse(KeyConcepts)
	var promptBuilder strings.Builder
	data := struct {
		Summary string
	}{
		Summary: abstract,
	}
	_ = t.Execute(&promptBuilder, data)
	res, err := model.Call(promptBuilder.String(), model.Chat)
	if err != nil {
		return ConceptGroup{}, fmt.Errorf("error extracting concepts: %v", err)
	}

	var concepts []string
	parts := strings.Split(res, ",")
	for i, part := range parts {
		parts[i] = strings.TrimSpace(part)
	}
	concepts = append(concepts, parts...)
	return ConceptGroup{
		Name:        name,
		Description: description,
		Concepts:    concepts,
	}, nil
}

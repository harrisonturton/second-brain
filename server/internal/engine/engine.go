package engine

import (
	"fmt"
	"strings"
	"text/template"

	"github.com/liappi/second-brain/server/internal/engine/abstract"
	"github.com/liappi/second-brain/server/internal/engine/concept"
	"github.com/liappi/second-brain/server/internal/engine/model"
	"github.com/liappi/second-brain/server/internal/engine/reference"
)

type EnhancedAbstract struct {
	Abstract   []string
	References []string
}

type Engine interface {
	GenerateEnhancedAbstracts(query string) ([]EnhancedAbstract, []concept.ConceptGroup, error)
}

// Generate a list of abstracts ordered in increasing complexity i.e. simple (primary school) -> complex (professor)
func GenerateEnhancedAbstracts(query string) ([]EnhancedAbstract, []concept.ConceptGroup, error) {
	promptGroups := make(map[string][]string)
	promptGroups["What"] = What
	promptGroups["Why"] = Why
	promptGroups["Examples"] = Examples
	promptGroups["Analogies"] = Analogies
	promptGroups["When"] = When
	promptGroups["Where"] = Where
	promptGroups["Who"] = Who
	promptGroups["How"] = How
	promptGroups["Up"] = Up
	promptGroups["Across"] = Across
	promptGroups["Down"] = Down

	var allInfos []string
	conceptGroups := make([]concept.ConceptGroup, 0)
	for name, promptGroup := range promptGroups {
		infos, err := getInfos(promptGroup, query)
		if err != nil {
			return nil, nil, fmt.Errorf("error getting info: %v", err)
		}
		allInfos = append(allInfos, strings.Join(infos, " "))

		// extract concepts from the raw info for each prompt group e.g. What, Why, Examples, etc.
		conceptGroup, err := concept.Extract(name, name, strings.Join(infos, " "))
		if err != nil {
			return nil, nil, fmt.Errorf("error extracting concepts: %v", err)
		}
		conceptGroups = append(conceptGroups, conceptGroup)
	}

	// generate abstracts for all complexity levels using the raw info
	abstracts, err := abstract.Generate(strings.Join(allInfos, " "))
	if err != nil {
		return nil, nil, fmt.Errorf("error generating abstracts: %v", err)
	}

	// get references for each claim in each abstract
	enhancedAbstracts := make(map[string]EnhancedAbstract)
	for complexity, a := range abstracts {
		claims := strings.Split(a, ". ")
		references, err := reference.Find(claims)
		if err != nil {
			return nil, nil, fmt.Errorf("error finding references: %v", err)
		}

		abstractList := make([]string, len(claims))
		referenceList := make([]string, len(claims))
		for i, r := range references {
			abstractList[i] = r.Sentence
			referenceList[i] = r.Url
		}
		enhancedAbstracts[complexity] = EnhancedAbstract{
			Abstract:   abstractList,
			References: referenceList,
		}
	}

	// flatten abstracts into a list ordered by complexity
	flattenedEnhancedAbstracts := make([]EnhancedAbstract, len(enhancedAbstracts))
	for i, level := range abstract.ExpertiseLevels {
		flattenedEnhancedAbstracts[i] = enhancedAbstracts[level]
	}

	return flattenedEnhancedAbstracts, conceptGroups, nil
}

// Gets raw info on a query according to a list of prompts
func getInfos(prompts []string, query string) ([]string, error) {
	var infos []string
	for _, prompt := range prompts {
		t, _ := template.New("info").Parse(prompt)
		var promptBuilder strings.Builder
		data := struct {
			Query string
		}{
			Query: query,
		}
		_ = t.Execute(&promptBuilder, data)
		res, err := model.Call(promptBuilder.String(), model.Chat)
		if err != nil {
			return nil, err
		}
		infos = append(infos, res)
	}
	return infos, nil
}

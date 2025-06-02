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

type LlmEngine struct {
}

func NewLlmEngine() *LlmEngine {
	return &LlmEngine{}
}

// GenerateEnhancedAbstracts generates a list of abstracts ordered in increasing complexity i.e. simple (primary school) -> complex (professor)
func (l *LlmEngine) GenerateEnhancedAbstracts(query string) ([]EnhancedAbstract, []concept.ConceptGroup, error) {
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
		fmt.Printf("Getting raw info dump on concept...\n")
		infos, err := l.getInfos(promptGroup, query)
		if err != nil {
			return nil, nil, fmt.Errorf("error getting info: %v", err)
		}
		allInfos = append(allInfos, strings.Join(infos, " "))

		// extract concepts from the raw info for each prompt group e.g. What, Why, Examples, etc.
		fmt.Printf("Extracting related concepts from info dump...\n")
		conceptGroup, err := concept.Extract(name, name, strings.Join(infos, " "))
		if err != nil {
			return nil, nil, fmt.Errorf("error extracting concepts: %v", err)
		}
		conceptGroups = append(conceptGroups, conceptGroup)
	}

	// generate abstracts for all complexity levels using the raw info
	fmt.Printf("Generating abstracts for all complexity levels from info dump...\n")
	abstracts, err := abstract.Generate(strings.Join(allInfos, " "))
	if err != nil {
		return nil, nil, fmt.Errorf("error generating abstracts: %v", err)
	}

	// get references for each claim in each abstract
	fmt.Printf("Getting references for all claims in all abstracts...\n")
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
	fmt.Printf("Order abstracts by complexity...\n")
	flattenedEnhancedAbstracts := make([]EnhancedAbstract, len(enhancedAbstracts))
	for i, level := range abstract.ExpertiseLevels {
		flattenedEnhancedAbstracts[i] = enhancedAbstracts[level]
	}

	fmt.Printf("Abstracts: %v\n", enhancedAbstracts)
	return flattenedEnhancedAbstracts, conceptGroups, nil
}

// Gets raw info on a query according to a list of prompts
func (l *LlmEngine) getInfos(prompts []string, query string) ([]string, error) {
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

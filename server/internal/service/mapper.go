package service

import (
	"fmt"
	"github.com/liappi/second-brain/server/internal/engine"
	"net/url"
	"strconv"
)

func mapEngineOutputToConcept(conceptName string, enhancedAbstracts []engine.EnhancedAbstract) (Concept, error) {
	abstracts, err := mapEnhancedAbstractsToAbstract(enhancedAbstracts)
	if err != nil {
		return Concept{}, fmt.Errorf("failed to map abstracts: %v", err)
	}
	return Concept{
		Name:        conceptName,
		Description: enhancedAbstracts[0].Abstract[0],
		Abstracts:   abstracts,
	}, nil
}

func mapEnhancedAbstractsToAbstract(enhancedAbstracts []engine.EnhancedAbstract) ([]Abstract, error) {
	abstracts := make([]Abstract, 0)
	for i, ea := range enhancedAbstracts {
		abstract := Abstract{
			Claims:     make([]Claim, 0),
			Complexity: strconv.Itoa(i),
		}
		for j, _ := range ea.Abstract {
			titleUrl, err := url.Parse(ea.References[j])
			if err != nil {
				return nil, fmt.Errorf("failed to parse url: %v", err)
			}
			abstract.Claims = append(abstract.Claims, Claim{
				Body: ea.Abstract[j],
				Source: Source{
					Title:   titleUrl.Path,
					Link:    ea.References[j],
					Preview: "<some preview>",
				},
			})
		}
		abstracts = append(abstracts, abstract)
	}
	return abstracts, nil
}

package openai

import "fmt"

const (
	apiUrl        = "https://api.openai.com/v1/chat/completions"
	developerRole = "developer"
	userRole      = "user"
	systemPrompt  = "Answer all questions in the context of automobiles and transport."
)

// Request body structure for OpenAI GPT-3/4 API
type Request struct {
	Model    string    `json:"model"`
	Messages []Message `json:"messages"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type OpenAI interface {
	callImpl(reqData Request) (string, error)
}

func Call(fakeMode bool, prompt, model string) (string, error) {
	var o OpenAI
	if fakeMode {
		o = &FakeOpenAi{}
	} else {
		o = &RealOpenAI{}
	}

	reqData := Request{
		Model: model,
		Messages: []Message{
			{
				Role:    developerRole,
				Content: systemPrompt,
			},
			{
				Role:    userRole,
				Content: prompt,
			},
		},
	}

	res, err := o.callImpl(reqData)
	if err != nil {
		return "", fmt.Errorf("error calling OpenAI: %v", err)
	}
	return res, nil
}

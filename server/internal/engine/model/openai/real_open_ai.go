package openai

import (
	"bytes"
	_ "embed"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

//go:embed key.txt
var apiKey string

// Response structure from OpenAI GPT API
type rawResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

type RealOpenAI struct{}

func (o RealOpenAI) callImpl(r Request) (string, error) {
	// Marshal the request into JSON
	reqBody, err := json.Marshal(r)
	if err != nil {
		return "", fmt.Errorf("error marshalling request data: %v", err)
	}

	// Create a new HTTP request
	req, err := http.NewRequest("POST", apiUrl, bytes.NewBuffer(reqBody))
	if err != nil {
		return "", fmt.Errorf("error creating request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+apiKey)

	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("error making API request: %v", err)
	}
	defer resp.Body.Close()

	// Read the response body
	respBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("error reading response body: %v", err)
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("openai returned %d: %s", resp.StatusCode, string(respBody))
	}

	// Parse the response
	var raw rawResponse
	err = json.Unmarshal(respBody, &raw)
	if err != nil {
		return "", fmt.Errorf("error unmarshalling response: %v (body: %s)", err, string(respBody))
	}

	if len(raw.Choices) == 0 {
		return "", fmt.Errorf("openai returned no choices (body: %s)", string(respBody))
	}

	// Return the first choice
	return raw.Choices[0].Message.Content, nil
}

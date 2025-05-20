package handlers

import (
	"context"
	service "github.com/liappi/second-brain/server/internal/service"
	"net/http"
)

type SearchRequest struct {
	Messages []Message `json:"messages"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type SearchResponse struct {
	Choices []struct {
		Message Message `json:"message"`
	} `json:"choices"`
}

// TODO: Call service and return result as HTTP response
func SearchHandler(w http.ResponseWriter, r *http.Request) {
	s := service.Service{}
	s.Search(ctx, req)
}

package handlers

import (
	"github.com/liappi/second-brain/server/internal/service"
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

func SearchHandler(s *service.Service) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// TODO: Call service and return result as HTTP response

		return
	}
}

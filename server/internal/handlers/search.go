package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/liappi/second-brain/server/internal/service"
)

func SearchHandler(s *service.Service) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query().Get("query")
		sessionId := r.URL.Query().Get("sessionId")
		fmt.Printf("Searching for query term: %s\n", query)

		result, err := s.Search(context.Background(), service.Request{
			SessionId: sessionId,
			Query:     query,
		})
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to get result: %v", err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")

		if err := json.NewEncoder(w).Encode(result); err != nil {
			http.Error(w, fmt.Sprintf("failed to encode response: %v", err), http.StatusInternalServerError)
			return
		}
	}
}

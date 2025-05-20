package handlers

import (
	"fmt"
	"net/http"
)

// Handler function for the root endpoint
func HomeHandler(w http.ResponseWriter, r *http.Request) {
	_, _ = fmt.Fprintf(w, "Welcome to the Go HTTP Server!")
}

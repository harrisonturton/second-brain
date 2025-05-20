package main

import (
	"fmt"
	"net/http"

	"github.com/liappi/second-brain/server/internal/handlers"
)

// Main starts the server
func main() {
	// Initialize the database connection
	// TODO: Initialize the database connection

	// Register handlers
	http.HandleFunc("/", handlers.HomeHandler)
	http.HandleFunc("/search", handlers.SearchHandler)

	// Start the server
	port := "8081"
	fmt.Printf("Server is listening on http://localhost:%s\n", port)
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		fmt.Printf("Error starting server: %s\n", err)
	}
}

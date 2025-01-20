package main

import (
	"fmt"
	"net/http"

	"github.com/liappi/second-brain/server/internal/handlers"
)

// Main function to start the server
func main() {
	// Register handlers
	http.HandleFunc("/", handlers.HomeHandler)
	http.HandleFunc("/chat", handlers.ChatHandler)

	// Start the server
	port := "8081"
	fmt.Printf("Server is listening on http://localhost:%s\n", port)
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		fmt.Printf("Error starting server: %s\n", err)
	}
}

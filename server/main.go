package main

import (
	"fmt"
	"net/http"
)

// Handler function for the root endpoint
func homeHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome to the Go HTTP Server!")
}

// Handler function for a specific endpoint
func helloHandler(w http.ResponseWriter, r *http.Request) {
	name := r.URL.Query().Get("name") // Get "name" parameter from the query string
	if name == "" {
		name = "World"
	}
	fmt.Fprintf(w, "Hello, %s!", name)
}

// Main function to start the server
func main() {
	// Register handlers
	http.HandleFunc("/", homeHandler)
	http.HandleFunc("/hello", helloHandler)

	// Start the server
	port := "8081"
	fmt.Printf("Server is listening on http://localhost:%s\n", port)
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		fmt.Printf("Error starting server: %s\n", err)
	}
}

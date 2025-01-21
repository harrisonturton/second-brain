package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/liappi/second-brain/server/internal/handlers"
	"github.com/liappi/second-brain/server/internal/repository"
)

// Main function to start the server
func main() {
	dbConfig := &repository.Config{
		Host:     "localhost",
		Port:     "5432",
		User:     "postgres",
		Password: "yourpassword",
		DBName:   "yourdatabase",
	}

	db, err := repository.NewConnection(dbConfig)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Register handlers
	http.HandleFunc("/", handlers.HomeHandler)
	http.HandleFunc("/chat", handlers.ChatHandler)

	// Start the server
	port := "8081"
	fmt.Printf("Server is listening on http://localhost:%s\n", port)
	err = http.ListenAndServe(":"+port, nil)
	if err != nil {
		fmt.Printf("Error starting server: %s\n", err)
	}
}

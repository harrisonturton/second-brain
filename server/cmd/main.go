package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"github.com/liappi/second-brain/server/internal/engine"
	"github.com/liappi/second-brain/server/internal/service"

	db "github.com/liappi/second-brain/server/internal/db/generated"
	"github.com/liappi/second-brain/server/internal/handlers"
	"github.com/liappi/second-brain/server/internal/repository"
	_ "github.com/lib/pq"
)

const dbUrl = "postgres://postgres:postgres@localhost:5432/second_brain?sslmode=disable"

// Main starts the server
func main() {
	// Initialize the database connection
	dbConn, err := sql.Open("postgres", dbUrl)
	if err != nil {
		fmt.Printf("Error connecting to database: %s\n", err)
		os.Exit(1)
	}
	defer dbConn.Close()

	// Test the connection
	if err := dbConn.Ping(); err != nil {
		fmt.Printf("Error pinging database: %s\n", err)
		os.Exit(1)
	}

	// Initialize the service
	queries := db.New(dbConn)
	repo := repository.New(queries)
	eng := engine.NewLlmEngine()
	svc := service.New(repo, eng)

	// Register handlers
	http.HandleFunc("/", handlers.HomeHandler)
	http.HandleFunc("/search", handlers.SearchHandler(svc))

	// Start the server
	port := "8081"
	fmt.Printf("Server is listening on http://localhost:%s\n", port)
	err = http.ListenAndServe(":"+port, nil)
	if err != nil {
		fmt.Printf("Error starting server: %s\n", err)
	}
}

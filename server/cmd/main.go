package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"

	db2 "github.com/liappi/second-brain/server/internal/db"
	"github.com/liappi/second-brain/server/internal/engine"
	"github.com/liappi/second-brain/server/internal/service"

	db "github.com/liappi/second-brain/server/internal/db/generated"
	"github.com/liappi/second-brain/server/internal/handlers"
	"github.com/liappi/second-brain/server/internal/repository"
	_ "github.com/lib/pq"
)

// corsMiddleware adds CORS headers to the response
func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

// Main starts the server
func main() {
	// Initialize the database connection
	dbConn, err := db2.OpenConn(db2.MainDbName)
	if err != nil {
		fmt.Printf("Error connecting to database: %s\n", err)
		os.Exit(1)
	}
	defer func(dbConn *sql.DB) {
		err := dbConn.Close()
		if err != nil {
			fmt.Printf("Error closing database connection: %s\n", err)
		}
	}(dbConn)

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

	// Register handlers with CORS middleware
	http.HandleFunc("/", corsMiddleware(handlers.HomeHandler))
	http.HandleFunc("/search", corsMiddleware(handlers.SearchHandler(svc)))

	// Start the server
	port := "8081"
	fmt.Printf("Server is listening on http://localhost:%s\n", port)
	err = http.ListenAndServe(":"+port, nil)
	if err != nil {
		fmt.Printf("Error starting server: %s\n", err)
	}
}

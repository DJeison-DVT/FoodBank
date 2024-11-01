package main

import (
	"log"
	"net/http"

	"backend_go/auth"
	"backend_go/config"
	"backend_go/database"
	"backend_go/handlers"
)

func main() {
	if err := config.LoadConfig(""); err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	database.ConnectDB()

	mux := http.NewServeMux()

	// OAuth2 login and callback routes
	mux.HandleFunc("/login", auth.HandleLogin)
	mux.HandleFunc("/callback", auth.HandleCallback)

	// Donation route for creating a new donation item
	mux.HandleFunc("/donations", handlers.CreateDonation)

	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}

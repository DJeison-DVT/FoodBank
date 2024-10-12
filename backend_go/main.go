package main

import (
	"log"
	"net/http"

	"github.com/DJeison-DVT/FoodBank/auth"
	"github.com/DJeison-DVT/FoodBank/database"
	"github.com/DJeison-DVT/FoodBank/handlers"
)

func main() {
	// Initialize the database connection
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

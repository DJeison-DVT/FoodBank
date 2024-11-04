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

	// update google oauth config with the correct redirect URL
	auth.UpdateGoogleOAuthConfig()

	database.ConnectDB()

	mux := http.NewServeMux()

	mux.HandleFunc("/register-token", auth.TokenSignInHandler)
	mux.HandleFunc("/tokenverify", auth.VerifyAccessTokenHandler)

	// Secure with JWT
	mux.HandleFunc("/donations", handlers.DonationHandler)
	mux.HandleFunc("/users", handlers.GetUserHandler)

	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}

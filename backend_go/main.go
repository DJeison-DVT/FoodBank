package main

import (
	"log"
	"net/http"

	"github.com/DJeison-DVT/FoodBank/auth"
)

func main() {
	mux := http.NewServeMux()

	// OAuth2 login and callback routesa
	mux.HandleFunc("/login", auth.HandleLogin)
	mux.HandleFunc("/callback", auth.HandleCallback)

	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}

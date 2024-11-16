package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	"backend_go/database"
	"backend_go/models"
	"backend_go/services"

	"io"
	"fmt"
)

func ProcessDonation(donation *models.Donation) (*models.Donation, error) {
	if donation.Type == "" || donation.Details == "" {
		return nil, errors.New("invalid donation data")
	}

	if err := database.DB.Create(donation).Error; err != nil {
		return nil, err
	}

	return donation, nil
}

func DonationHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	switch r.Method {
	case http.MethodGet:
		var donations []models.Donation
		if err := database.DB.Find(&donations).Error; err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(donations)

	case http.MethodPost:
		var donation models.Donation

		// Read the body into a variable for debugging
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusInternalServerError)
			return
		}
		defer r.Body.Close() // Close the body after reading

		// Log the raw body for debugging purposes
		fmt.Println("Received request body:", string(body))

		// Now decode the JSON
		if err := json.Unmarshal(body, &donation); err != nil {
			http.Error(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
			return
		}

		// Ensure Images is a valid array of strings
		if donation.Images == nil {
			donation.Images = []string{} // Initialize as an empty array if nil
		}

		// Log the donation data to ensure Images is properly populated
		fmt.Println("Processed donation:", donation)

		// Process the donation
		savedDonation, err := ProcessDonation(&donation)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Respond with the saved donation
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(savedDonation)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}


func GetPresignedURL(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8081")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	userID := r.URL.Query().Get("id")
	user, err := services.GetUser(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(user)
}

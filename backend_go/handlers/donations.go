package handlers

import (
	"encoding/json"
	"errors"
	"net/http"

	"backend_go/database"
	"backend_go/models"
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
		if err := json.NewDecoder(r.Body).Decode(&donation); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		savedDonation, err := ProcessDonation(&donation)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(savedDonation)

	default:
		// Method not allowed if it's not GET or POST
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

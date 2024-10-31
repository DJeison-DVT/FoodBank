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

func CreateDonation(w http.ResponseWriter, r *http.Request) {
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
}

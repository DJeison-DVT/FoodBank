package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"github.com/gorilla/mux"
	"strconv"

	"backend_go/database"
	"backend_go/models"

)

// ProcessDonation = Create, DB call.

func ProcessDonation(donation *models.Donation) (*models.Donation, error) {
	if donation.Type == "" || donation.Details == "" {
		return nil, errors.New("invalid donation data")
	}

	if err := database.DB.Create(donation).Error; err != nil {
		return nil, err
	}

	return donation, nil
}

// CreateDonation = Create, Handler

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

// RetrieveDonation = Read, DB call.

func RetrieveDonation(donationID uint) (*models.Donation, error) {
    var retrievedDonation models.Donation

    if err := database.DB.First(&retrievedDonation, donationID).Error; err != nil {
        return nil, err
    }

    return &retrievedDonation, nil
}

// ReadDonation = Read, Handler.

func ReadDonation(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r) // Get the URL parameters
	idStr := vars["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID parameter", http.StatusBadRequest)
		return
	}

	fetchedDonation, err := RetrieveDonation(uint(id))
	if err != nil {
		http.Error(w, "Donation not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(fetchedDonation); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

// DropDonation = Delete, DB call.

func DropDonation(donationID uint) (uint, error) {
	if err := database.DB.Delete(&models.Donation{}, donationID).Error; err != nil {
		return 0, err
	}

	return donationID, nil
}

// DeleteDonation = Delete, Handler.

func DeleteDonation(w http.ResponseWriter, r *http.Request) {
	var donationID uint

	if err := json.NewDecoder(r.Body).Decode(donationID); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	deletedDonation, err := DropDonation(donationID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(deletedDonation)
}
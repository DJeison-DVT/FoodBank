package handlers

import (
	"encoding/json"
	"net/http"

	"backend_go/models"
	"backend_go/services"

	"io"
)

func DonationHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	switch r.Method {
	case http.MethodGet:
		handleDonationGet(w, r)
	case http.MethodPost:
		handleDonationPost(w, r)
	case http.MethodDelete:
		handleDonationDelete(w, r)
	default:
		RespondWithError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func handleDonationPost(w http.ResponseWriter, r *http.Request) {
	var donation models.Donation

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	if err := json.Unmarshal(body, &donation); err != nil {
		http.Error(w, "Invalid JSON payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if donation.Images == nil {
		donation.Images = json.RawMessage("[]")
	}

	savedDonation, err := services.ProcessDonation(&donation)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(savedDonation)
}

func handleDonationDelete(w http.ResponseWriter, r *http.Request) {
	donationIDStr := r.URL.Query().Get("id")
	if donationIDStr == "" {
		RespondWithError(w, http.StatusBadRequest, "Missing donation ID")
		return
	}

	donationID, err := ParseStrToUint(donationIDStr)
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}
	err = services.DeleteDonation(donationID)
	if err != nil {
		RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	RespondWithMessage(w, http.StatusOK, "Donation deleted successfully")
}

func handleDonationGet(w http.ResponseWriter, r *http.Request) {
	donationIDStr := r.URL.Query().Get("id")
	if donationIDStr == "" {
		RespondWithError(w, http.StatusBadRequest, "Missing donation ID")
		return
	}

	donationID, err := ParseStrToUint(donationIDStr)
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	donation, err := services.GetDonation(donationID)
	if err != nil {
		RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(donation)
}

package handlers

import (
	"backend_go/services"
	"encoding/json"
	"net/http"
)

func UserHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8081")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	userID := r.URL.Query().Get("id")
	if userID == "" {
		RespondWithError(w, http.StatusBadRequest, "Missing user ID")
		return
	}

	// Route based on method
	switch r.Method {
	case http.MethodGet:
		handleGetUser(w, r, userID)
	case http.MethodPut:
		handleUpdateUserPickupDetails(w, r, userID)
	default:
		RespondWithError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}

func handleGetUser(w http.ResponseWriter, r *http.Request, userID string) {
	user, err := services.GetUser(userID)
	if err != nil {
		RespondWithError(w, http.StatusInternalServerError, "Failed to fetch user")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func handleUpdateUserPickupDetails(w http.ResponseWriter, r *http.Request, userID string) {
	payload := struct {
		Address       string `json:"address"`
		PickupDetails string `json:"pickupDetails"`
	}{}

	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	user, err := services.GetUser(userID)
	if err != nil {
		RespondWithError(w, http.StatusInternalServerError, "Failed to fetch user")
		return
	}

	address := payload.Address
	pickupDetails := payload.PickupDetails
	if address == "" || pickupDetails == "" {
		RespondWithError(w, http.StatusBadRequest, "Missing address or pickup details")
		return
	}

	updatedUser, err := services.UpdateUserPickupDetails(user, address, pickupDetails)
	if err != nil {
		RespondWithError(w, http.StatusInternalServerError, "Failed to update user pickup details")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(updatedUser)
}

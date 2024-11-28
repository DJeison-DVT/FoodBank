package orders

import (
	"backend_go/services"
	"encoding/json"
	"net/http"
)

func OrderHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8081")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, "user_id query parameter is required", http.StatusBadRequest)
		return
	}

	user, err := services.GetUser(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if user.Role == "staff" {
		if r.Method == http.MethodGet {
			orders, err := services.GetVerificationPendingOrders()
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			if err := json.NewEncoder(w).Encode(orders); err != nil {
				http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			}
		}
	} else {
		switch r.Method {
		case http.MethodGet:
			handleActiveOrderGet(w, userID)
		case http.MethodPost:
			handleActiveOrderPost(w, userID)
		}
	}
}

func handleActiveOrderGet(w http.ResponseWriter, userID string) {
	order, err := services.GetUserActiveOrder(userID)
	if err != nil {
		if err.Error() == "record not found" {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(order); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func handleActiveOrderPost(w http.ResponseWriter, userID string) {
	order, err := services.CreateOrder(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(order)
}

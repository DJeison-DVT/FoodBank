package orders

import (
	"backend_go/handlers"
	"backend_go/models"
	"backend_go/services"
	"net/http"
)

func OrderVerificationHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		handlers.RespondWithError(w, http.StatusBadRequest, "user_id query parameter is required")
		return
	}

	user, err := services.GetUser(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if user.Role != "staff" {
		handleSetOrderAsWaitingForVerification(w, user)
	} else {
		handleOrderVerify(w, r)
	}
}

func handleSetOrderAsWaitingForVerification(w http.ResponseWriter, user models.User) {
	order, err := services.GetUserActiveOrder(user.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if order.Status == models.StatusNeedsToBeChecked && services.HasRejectedDonations(&order) {
		handlers.RespondWithError(w, http.StatusBadRequest, "Order has rejected donations")
		return
	} else if order.Status != models.StatusBeingModified && order.Status != models.StatusNeedsToBeChecked {
		handlers.RespondWithError(w, http.StatusBadRequest, "Order is not being modified")
		return
	}

	err = services.UpdateOrderStatus(&order, models.StatusNeedsToBeVerified)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	handlers.RespondWithMessage(w, http.StatusOK, "Order is now waiting for verification")
}

func handleOrderVerify(w http.ResponseWriter, r *http.Request) {
	payload := struct {
		OrderID           uint   `json:"order_id"`
		RejectedDonations []uint `json:"rejected_donations"`
	}{}

	if err := handlers.ParseJSON(r.Body, &payload); err != nil {
		handlers.RespondWithError(w, http.StatusBadRequest, "Invalid JSON payload")
		return
	}

	if payload.OrderID == 0 {
		handlers.RespondWithError(w, http.StatusBadRequest, "order_id is required in the payload")
		return
	}

	order, err := services.GetOrder(payload.OrderID)
	if err != nil {
		handlers.RespondWithError(w, http.StatusBadRequest, "Order not found")
		return
	}

	if order.Status != models.StatusNeedsToBeVerified {
		handlers.RespondWithError(w, http.StatusBadRequest, "Order is not waiting for verification")
		return
	}

	if len(payload.RejectedDonations) > 0 {
		// Reject the order if any donations are rejected
		err := services.RejectOrder(&order, payload.RejectedDonations)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		handlers.RespondWithMessage(w, http.StatusOK, "Order rejected")
	} else {
		// If no donations are rejected, verify the order
		err := services.VerifyOrder(&order)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		handlers.RespondWithMessage(w, http.StatusOK, "Order verified")
	}
}

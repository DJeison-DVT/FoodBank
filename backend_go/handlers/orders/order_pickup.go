package orders

import (
	"backend_go/handlers"
	"backend_go/models"
	"backend_go/services"
	"net/http"
)

// TODO fill with pickup order logic using QR code
// The current field is on Order.VerificationQRCode
func OrderPickupHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8081")
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
		handlers.RespondWithError(w, http.StatusForbidden, "Only staff can schedule orders")
	} else {
		pickupOrder(w, r)
	}
}

func pickupOrder(w http.ResponseWriter, r *http.Request) {
	payload := struct {
		OrderID uint `json:"order_id"`
	}{}

	if err := handlers.ParseJSON(r.Body, &payload); err != nil {
		handlers.RespondWithError(w, http.StatusBadRequest, "Invalid JSON payload")
		return
	}

	order, err := services.GetOrder(payload.OrderID)
	if err != nil {
		handlers.RespondWithError(w, http.StatusBadRequest, "Order not found")
		return
	}

	// Use this function to change the status of the order to "PickedUp" or create a new function at services/order.go
	err = services.UpdateOrderStatus(&order, models.StatusPickedUp)
	if err != nil {
		handlers.RespondWithError(w, http.StatusInternalServerError, "Failed to update order status")
		return
	}

	handlers.RespondWithMessage(w, http.StatusOK, "Order picked up successfully")
}

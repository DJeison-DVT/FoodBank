package orders

import (
	"backend_go/handlers"
	"backend_go/services"
	"net/http"
)

func OrderScheduleHandler(w http.ResponseWriter, r *http.Request) {
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
		handlers.RespondWithError(w, http.StatusForbidden, "Only staff can schedule orders")
	} else {
		scheduleOrder(w, r)
	}
}

func scheduleOrder(w http.ResponseWriter, r *http.Request) {
	payload := struct {
		OrderID    uint   `json:"order_id"`
		PickupDate string `json:"pickup_date"`
		PickupTime string `json:"pickup_time"`
	}{}

	if err := handlers.ParseJSON(r.Body, &payload); err != nil {
		handlers.RespondWithError(w, http.StatusBadRequest, "Invalid JSON payload")
		return
	}

	if payload.OrderID == 0 {
		handlers.RespondWithError(w, http.StatusBadRequest, "Order ID is required")
		return
	}
	if payload.PickupDate == "" || payload.PickupTime == "" {
		handlers.RespondWithError(w, http.StatusBadRequest, "Pickup date and time are required")
		return
	}

	order, err := services.GetOrder(payload.OrderID)
	if err != nil {
		handlers.RespondWithError(w, http.StatusInternalServerError, "Order not found")
		return
	}

	err = services.ScheduleOrder(&order, payload.PickupDate, payload.PickupTime)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	handlers.RespondWithMessage(w, http.StatusOK, "Order scheduled successfully")
}

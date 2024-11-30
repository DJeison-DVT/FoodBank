package services

import (
	"testing"
	"backend_go/database"
	"backend_go/models"
)

// Create Order
func TestCreateOrder_ValidData(t *testing.T) {
	database.DB = setupTestDB()

	userID := "111111111111111111111111111"
	userEmail := "dummy@gmail.com"
	userName := "dummy"
	userPicture := "thisisapictureurl.com"

	userFields := map[string]interface{}{
		"id":      userID,
		"email":   userEmail,
		"name":    userName,
		"picture": userPicture,
	}

	savedUser, err := CreateUser(userFields)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	savedOrder, err := CreateOrder(savedUser.ID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if savedOrder.Status != models.StatusBeingModified || savedOrder.UserID != userID {
		t.Errorf("Expected status BeingModified, got %v", savedOrder.Status)
	}

	// Clean up
	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder.ID)
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

func TestCreateOrder_InvalidData(t *testing.T) {
	database.DB = setupTestDB()

	userID := "1"

	_, err := CreateOrder(userID)
	if err == nil {
		t.Errorf("Expected an error, got none")
	}
}

// Get Order
func TestGetOrder_ValidData(t *testing.T) {
	database.DB = setupTestDB()

	userID := "111111111111111111111111111"
	userEmail := "dummy@gmail.com"
	userName := "dummy"
	userPicture := "thisisapictureurl.com"

	userFields := map[string]interface{}{
		"id":      userID,
		"email":   userEmail,
		"name":    userName,
		"picture": userPicture,
	}

	savedUser, err := CreateUser(userFields)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	savedOrder, err := CreateOrder(savedUser.ID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	getOrder, err := GetOrder(savedOrder.ID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if savedOrder.Status != getOrder.Status || savedOrder.UserID != getOrder.UserID {
		t.Errorf("Expected different order data, got %v", getOrder)
	}

	// Clean up
	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder.ID)
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

func TestGetOrder_InvalidData(t *testing.T) {
	database.DB = setupTestDB()

	userID := "111111111111111111111111111"
	userEmail := "dummy@gmail.com"
	userName := "dummy"
	userPicture := "thisisapictureurl.com"

	userFields := map[string]interface{}{
		"id":      userID,
		"email":   userEmail,
		"name":    userName,
		"picture": userPicture,
	}

	savedUser, err := CreateUser(userFields)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	savedOrder, err := CreateOrder(savedUser.ID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder.ID)

	_, err = GetOrder(savedOrder.ID)
	if err == nil {
		t.Errorf("Expected an error, got none")
	}

	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

// Get User Active Order
func TestGetUserActiveOrder_ValidData(t *testing.T) { // mark
	database.DB = setupTestDB()

	userID := "111111111111111111111111111"
	userEmail := "dummy@gmail.com"
	userName := "dummy"
	userPicture := "thisisapictureurl.com"

	userFields := map[string]interface{}{
		"id":      userID,
		"email":   userEmail,
		"name":    userName,
		"picture": userPicture,
	}

	savedUser, err := CreateUser(userFields)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	savedOrder, err := CreateOrder(savedUser.ID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	donation := &models.Donation{
		Type:    "food",
		Details: "Canned goods",
		OrderID: savedOrder.ID,
	}

	savedDonation, err := ProcessDonation(donation)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	getOrder, err := GetUserActiveOrder(userID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if savedOrder.Status != getOrder.Status || savedOrder.UserID != getOrder.UserID {
		t.Errorf("Expected different order data, got %v", getOrder)
	}

	// Clean up
	database.DB.Unscoped().Delete(&models.Donation{}, "id = ?", savedDonation.ID)
	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", getOrder.ID)
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

func TestGetUserActiveOrder_InvalidData(t *testing.T) {
	database.DB = setupTestDB()

	userID := "111111111111111111111111111"
	userEmail := "dummy@gmail.com"
	userName := "dummy"
	userPicture := "thisisapictureurl.com"

	userFields := map[string]interface{}{
		"id":      userID,
		"email":   userEmail,
		"name":    userName,
		"picture": userPicture,
	}

	savedUser, err := CreateUser(userFields)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	savedOrder, err := CreateOrder(savedUser.ID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder.ID)

	getOrder, err := GetUserActiveOrder(userID)
	if err == nil {
		t.Errorf("Expected an error, got no	ne and %v", getOrder)
	}
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

// Update Order Status
func TestUpdateOrderStatus_ValidData(t *testing.T) {
	database.DB = setupTestDB()

	userID := "111111111111111111111111111"
	userEmail := "dummy@gmail.com"
	userName := "dummy"
	userPicture := "thisisapictureurl.com"

	userFields := map[string]interface{}{
		"id":      userID,
		"email":   userEmail,
		"name":    userName,
		"picture": userPicture,
	}

	savedUser, err := CreateUser(userFields)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	savedOrder, err := CreateOrder(savedUser.ID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	err = UpdateOrderStatus(&savedOrder, models.StatusNeedsToBeChecked)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	updatedOrder, err := GetOrder(savedOrder.ID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if updatedOrder.Status != models.StatusNeedsToBeChecked {
		t.Errorf("Expected status to be NeedsToBeChecked, got %v", updatedOrder.Status)
	}

	// Clean up
	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder.ID)
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

func TestUpdateOrderStatus_InvalidData(t *testing.T) {
	database.DB = setupTestDB()

	userID := "111111111111111111111111111"
	userEmail := "dummy@gmail.com"
	userName := "dummy"
	userPicture := "thisisapictureurl.com"

	userFields := map[string]interface{}{
		"id":      userID,
		"email":   userEmail,
		"name":    userName,
		"picture": userPicture,
	}

	savedUser, err := CreateUser(userFields)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	savedOrder, err := CreateOrder(savedUser.ID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	err = UpdateOrderStatus(&savedOrder, "modified")
	if err == nil {
		t.Errorf("Expected an error, got no	one")
	}

	// Clean up
	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder.ID)
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

// Verify Order
func TestVerifyOrder_ValidData(t *testing.T) {
	database.DB = setupTestDB()

	userID := "111111111111111111111111111"
	userEmail := "dummy@gmail.com"
	userName := "dummy"
	userPicture := "thisisapictureurl.com"

	userFields := map[string]interface{}{
		"id":      userID,
		"email":   userEmail,
		"name":    userName,
		"picture": userPicture,
	}

	savedUser, err := CreateUser(userFields)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	savedOrder, err := CreateOrder(savedUser.ID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	err = VerifyOrder(&savedOrder)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	updatedOrder, err := GetOrder(savedOrder.ID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if updatedOrder.Status != models.StatusVerified {
		t.Errorf("Expected status to be Verified, got %v", updatedOrder.Status)
	}

	// Clean up
	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder.ID)
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

// Schedule Order
func TestScheduleOrder_ValidData(t *testing.T) {
	database.DB = setupTestDB()

	userID := "111111111111111111111111111"
	userEmail := "dummy@gmail.com"
	userName := "dummy"
	userPicture := "thisisapictureurl.com"

	userFields := map[string]interface{}{
		"id":      userID,
		"email":   userEmail,
		"name":    userName,
		"picture": userPicture,
	}

	savedUser, err := CreateUser(userFields)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	savedOrder, err := CreateOrder(savedUser.ID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	err = VerifyOrder(&savedOrder)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	updatedOrder, err := GetOrder(savedOrder.ID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	err = ScheduleOrder(&updatedOrder, "today", "5pm")
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if updatedOrder.Status != models.StatusScheduled {
		t.Errorf("Expected status to be Scheduled, got %v", updatedOrder.Status)
	}

	// Clean up
	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder.ID)
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

// Get Verification Pending Orders
func TestGetVerificationPendingOrders_ValidData(t *testing.T) {
	database.DB = setupTestDB()

	userID := "111111111111111111111111111"
	userEmail := "dummy@gmail.com"
	userName := "dummy"
	userPicture := "thisisapictureurl.com"

	userFields := map[string]interface{}{
		"id":      userID,
		"email":   userEmail,
		"name":    userName,
		"picture": userPicture,
	}

	savedUser, err := CreateUser(userFields)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	savedOrder, err := CreateOrder(savedUser.ID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	savedOrder2, err := CreateOrder(userID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	err = UpdateOrderStatus(&savedOrder2, models.StatusNeedsToBeVerified)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	pendingOrders, err := GetVerificationPendingOrders()
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if len(pendingOrders) == 0 {
        t.Errorf("Expected one pending order, got 0")
    }

	for _, pendingOrder := range pendingOrders {
        if pendingOrder.Status != models.StatusNeedsToBeVerified {
            t.Errorf("Expected status to be NeedsToBeVerified, got %v", pendingOrder.Status)
        }
    }

	// Clean up
	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder.ID)
	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder2.ID)
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

// Get Schedule Pending Orders
func TestGetSchedulePendingOrders_ValidData(t *testing.T) {
	database.DB = setupTestDB()

	userID := "111111111111111111111111111"
	userEmail := "dummy@gmail.com"
	userName := "dummy"
	userPicture := "thisisapictureurl.com"

	userFields := map[string]interface{}{
		"id":      userID,
		"email":   userEmail,
		"name":    userName,
		"picture": userPicture,
	}

	savedUser, err := CreateUser(userFields)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	savedOrder, err := CreateOrder(savedUser.ID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	savedOrder2, err := CreateOrder(userID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	err = UpdateOrderStatus(&savedOrder2, models.StatusVerified)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	pendingOrders, err := GetSchedulePendingOrders()
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if len(pendingOrders) == 0 {
        t.Errorf("Expected one pending order, got 0")
    }

	for _, pendingOrder := range pendingOrders {
        if pendingOrder.Status != models.StatusVerified {
            t.Errorf("Expected status to be Verified, got %v", pendingOrder.Status)
        }
    }

	// Clean up
	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder.ID)
	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder2.ID)
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

// Get Pickup Pending Orders
func TestGetPickupPendingOrders_ValidData(t *testing.T) {
	database.DB = setupTestDB()

	userID := "111111111111111111111111111"
	userEmail := "dummy@gmail.com"
	userName := "dummy"
	userPicture := "thisisapictureurl.com"

	userFields := map[string]interface{}{
		"id":      userID,
		"email":   userEmail,
		"name":    userName,
		"picture": userPicture,
	}

	savedUser, err := CreateUser(userFields)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	savedOrder, err := CreateOrder(savedUser.ID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	savedOrder2, err := CreateOrder(userID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	err = UpdateOrderStatus(&savedOrder2, models.StatusScheduled)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	pendingOrders, err := GetPickupPendingOrders()
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if len(pendingOrders) == 0 {
        t.Errorf("Expected one pending order, got 0")
    }

	for _, pendingOrder := range pendingOrders {
        if pendingOrder.Status != models.StatusScheduled {
            t.Errorf("Expected status to be Scheduled, got %v", pendingOrder.Status)
        }
    }

	// Clean up
	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder.ID)
	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder2.ID)
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

// Get Completed Orders
func TestGetCompletedOrders_ValidData(t *testing.T) {
	database.DB = setupTestDB()

	userID := "111111111111111111111111111"
	userEmail := "dummy@gmail.com"
	userName := "dummy"
	userPicture := "thisisapictureurl.com"

	userFields := map[string]interface{}{
		"id":      userID,
		"email":   userEmail,
		"name":    userName,
		"picture": userPicture,
	}

	savedUser, err := CreateUser(userFields)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	savedOrder, err := CreateOrder(savedUser.ID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	savedOrder2, err := CreateOrder(userID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	err = UpdateOrderStatus(&savedOrder2, models.StatusPickedUp)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	completedOrders, err := GetCompletedOrders(userID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if len(completedOrders) == 0 {
        t.Errorf("Expected one completed order, got 0")
    }

	for _, completedOrder := range completedOrders {
        if completedOrder.Status != models.StatusPickedUp {
            t.Errorf("Expected status to be PickedUp, got %v", completedOrder.Status)
        }
    }

	// Clean up
	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder.ID)
	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder2.ID)
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

// Reject Order
func TestRejectOrder_ValidData(t *testing.T) {
	database.DB = setupTestDB()

	userID := "111111111111111111111111111"
	userEmail := "dummy@gmail.com"
	userName := "dummy"
	userPicture := "thisisapictureurl.com"

	userFields := map[string]interface{}{
		"id":      userID,
		"email":   userEmail,
		"name":    userName,
		"picture": userPicture,
	}

	savedUser, err := CreateUser(userFields)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	savedOrder, err := CreateOrder(savedUser.ID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	donation := &models.Donation{
		Type:    "food",
		Details: "Canned goods",
		OrderID: savedOrder.ID,
	}

	savedDonation, err := ProcessDonation(donation)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	err = RejectOrder(&savedOrder, []uint{savedDonation.ID})
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	updatedOrder, err := GetOrder(savedOrder.ID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if updatedOrder.Status != models.StatusNeedsToBeChecked {
		t.Errorf("Expected status to be NeedsToBeVerified, got %v", updatedOrder.Status)
	}

	// Clean up
	database.DB.Unscoped().Delete(&models.Donation{}, "id = ?", savedDonation.ID)
	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder.ID)
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

// Has Rejected Donations
func TestHasRejectedDonations_ValidData(t *testing.T) {
	database.DB = setupTestDB()

	userID := "111111111111111111111111111"
	userEmail := "dummy@gmail.com"
	userName := "dummy"
	userPicture := "thisisapictureurl.com"

	userFields := map[string]interface{}{
		"id":      userID,
		"email":   userEmail,
		"name":    userName,
		"picture": userPicture,
	}

	savedUser, err := CreateUser(userFields)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	savedOrder, err := CreateOrder(savedUser.ID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	donation := &models.Donation{
		Type:    "food",
		Details: "Canned goods",
		OrderID: savedOrder.ID,
	}

	savedDonation, err := ProcessDonation(donation)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	err = RejectOrder(&savedOrder, []uint{savedDonation.ID})
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	updatedOrder, err := GetOrder(savedOrder.ID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	hasRejected := HasRejectedDonations(&updatedOrder)
	if !hasRejected {
		t.Error("Expected rejected donations")
	}

	// Clean up
	database.DB.Unscoped().Delete(&models.Donation{}, "id = ?", savedDonation.ID)
	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder.ID)
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}
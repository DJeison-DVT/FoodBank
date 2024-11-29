package services

import (
	"testing"
	"backend_go/database"
	"backend_go/models"
)

// CreateUser
func TestCreateUser_ValidData(t *testing.T) {
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

	if savedUser.ID != userID || savedUser.Email != userEmail {
		t.Errorf("Expected savedUser data to be %v, got %v", userFields, savedUser)
	}

	// Clean up
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

func TestCreateUser_InvalidData(t *testing.T) {
	database.DB = setupTestDB()

	userID := "111111111111111111111111111"
	userEmail := ""
	userName := ""
	userPicture := ""

	userFields := map[string]interface{}{
		"id":      userID,
		"email":   userEmail,
		"name":    userName,
		"picture": userPicture,
	}

	_, err := CreateUser(userFields)
	if err == nil {
		t.Errorf("Expected an error, got none")
	}

}

// GetUser
func TestGetUser_ValidData(t *testing.T) {
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

	getUser, err := GetUser(savedUser.ID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if savedUser.ID != getUser.ID || savedUser.Email != getUser.Email {
		t.Errorf("Expected getUser data to be %v, got %v", savedUser, getUser)
	}

	// Clean up
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

func TestGetUser_ErasedUser(t *testing.T) {
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

	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)

	_, err = GetUser(savedUser.ID)
	if err == nil {
		t.Errorf("Expected an error, got none")
	}
}

// UpdateUser
func TestUpdateUser_ValidData(t *testing.T) {
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

	editedEmail := "edited@gmail.com"
	editedName := "edited"
	editedPicture := "editedpictureurl.com"

	savedUser.Email = editedEmail
	savedUser.Name = editedName
	savedUser.Picture = editedPicture

	err = UpdateUser(savedUser)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	getUser, err := GetUser(savedUser.ID)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if getUser.Email != editedEmail || getUser.Name != editedName || getUser.Picture != editedPicture {
		t.Errorf("Expected getUser data to be %v, got %v", savedUser, getUser)
	}

	// Clean up
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

// UpsertUser
func TestUpsertUser_ValidData(t *testing.T) {
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

	savedUser, err := UpsertUser(userFields)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if savedUser.Email != userEmail || savedUser.Name != userName || savedUser.Picture != userPicture {
		t.Errorf("Expected getUser data to be %v, got %v", userFields, savedUser)
	}

	editedEmail := "edited@gmail.com"
	editedName := "edited"
	editedPicture := "editedpictureurl.com"

	userFields = map[string]interface{}{
		"id":      userID,
		"email":   editedEmail,
		"name":    editedName,
		"picture": editedPicture,
	}

	savedUser, err = UpsertUser(userFields)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if savedUser.Email != editedEmail || savedUser.Name != editedName || savedUser.Picture != editedPicture {
		t.Errorf("Expected getUser data to be %v, got %v", userFields, savedUser)
	}

	// Clean up
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

// UpdateUserPickupDetails
func TestUpdateUserPickupDetails_ValidData(t *testing.T) {
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

	userAddress := "this is an address"
	userPickupDetails := "this are some details"

	updatedUser, err := UpdateUserPickupDetails(savedUser, userAddress, userPickupDetails)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if updatedUser.Address != userAddress || updatedUser.PickupDetails != userPickupDetails {
		t.Errorf("Expected updatedUser address and details to be %v and %v, got %v and %v", userAddress, userPickupDetails, updatedUser.Address, updatedUser.PickupDetails)
	}

	// Clean up
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

// MakeStaff
func TestMakeStaff_ValidData(t *testing.T) {
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

	staffUser, err := MakeStaff(savedUser)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if staffUser.Role != "staff" {
		t.Errorf("Expected staffUser role to be staff, got %v", staffUser.Role)
	}

	// Clean up
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}
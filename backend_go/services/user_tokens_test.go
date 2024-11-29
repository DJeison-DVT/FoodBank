package services

import (
	"testing"
	"backend_go/database"
	"backend_go/models"
)

// RegisterAccessToken
func TestRegisterAccessToken_ValidData(t *testing.T) {
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

	requiredFields := map[string]string{
		"access_token":		"222", 
		"expires_in":		"1",
		"issued_at":		"2",
		"token_type":		"2",
	}

	registeredToken, err := RegisterAccessToken(savedUser, requiredFields)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	// Clean up
	database.DB.Unscoped().Delete(&models.UserToken{}, "id = ?", registeredToken.ID)
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)

}

// GetAccessToken
// func TestGetAccessToken_ValidData(t *testing.T) {
// 	database.DB = setupTestDB()

// 	userID := "111111111111111111111111111"
// 	userEmail := "dummy@gmail.com"
// 	userName := "dummy"
// 	userPicture := "thisisapictureurl.com"

// 	userFields := map[string]interface{}{
// 		"id":      userID,
// 		"email":   userEmail,
// 		"name":    userName,
// 		"picture": userPicture,
// 	}

// 	savedUser, err := CreateUser(userFields)
// 	if err != nil {
// 		t.Errorf("Expected no error, got %v", err)
// 	}

// 	accessToken := "222"
// 	expiresIn := "1"
// 	issuedAt := "2"
// 	tokenType := "2"

// 	requiredFields := map[string]string{
// 		"access_token":		accessToken, 
// 		"expires_in":		expiresIn,
// 		"issued_at":		issuedAt,
// 		"token_type":		tokenType,
// 	}

// 	registeredToken, err := RegisterAccessToken(savedUser, requiredFields)
// 	if err != nil {
// 		t.Errorf("Expected no error, got %v", err)
// 	}

// 	getToken, err := GetAccessToken(savedUser.ID)
// 	if err != nil {
// 		t.Errorf("Expected no error, got %v", err)
// 	}

// 	if getToken.ID != registeredToken.ID || getToken.Token != registeredToken.Token {
// 		t.Errorf("Expected getToken data to be %v, got %v", registeredToken, getToken)
// 	}

// 	// Clean up
// 	database.DB.Unscoped().Delete(&models.UserToken{}, "id = ?", registeredToken.ID)
// 	database.DB.Unscoped().Delete(&models.UserToken{}, "id = ?", getToken.ID)
// 	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)

// }

// AccessTokenIsvalid


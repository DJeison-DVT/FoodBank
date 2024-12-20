package services

import (
	"fmt"
	"log"
	"path/filepath"
	"strings"
	"testing"
	// "encoding/json"

	"backend_go/config"
	"backend_go/database"
	"backend_go/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func TestMain(m *testing.M) {
	envPath := filepath.Join("..", ".env")
	if err := config.LoadConfig(envPath); err != nil {
		log.Fatalf("Failed to load config in tests: %v", err)
	}

	fmt.Println(config.DatabaseURL)

	// Run tests
	m.Run()
}

func setupTestDB() *gorm.DB {
	dsn := config.DatabaseURL
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		panic("failed to connect to test database")
	}

	db.AutoMigrate(&models.Donation{})
	return db
}

func TestProcessDonation_ValidData(t *testing.T) {
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

	if savedDonation.Type != "food" || savedDonation.Details != "Canned goods" {
		t.Errorf("Expected food donation, got %v", savedDonation)
	}

	// Clean up
	database.DB.Unscoped().Delete(&models.Donation{}, "id = ?", savedDonation.ID)
	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder.ID)
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

func TestProcessDonation_InvalidData(t *testing.T) {
	database.DB = setupTestDB()

	donation := &models.Donation{}

	_, err := ProcessDonation(donation)
	if err == nil {
		t.Errorf("Expected an error, got none")
	}
} 

// // Additional test cases

func TestProcessDonation_MissingDetails(t *testing.T) {
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
		Type: "medicine",
		OrderID: savedOrder.ID,
	}

	_, err = ProcessDonation(donation)
	if err == nil {
		t.Errorf("Expected error due to missing details, got none")
	}

	// Clean up
	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder.ID)
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

func TestProcessDonation_EmptyType(t *testing.T) {
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
		Type:    "",
		Details: "Blankets",
		OrderID: savedOrder.ID,
	}

	_, err = ProcessDonation(donation)
	if err == nil {
		t.Errorf("Expected error due to missing type, got none")
	}
	// Clean up
	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder.ID)
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

func TestProcessDonation_VeryLongDetails(t *testing.T) {
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

	longDetails := "A" + strings.Repeat("B", 5000)
	donation := &models.Donation{
		Type:    "food",
		Details: longDetails,
		OrderID: savedOrder.ID,
	}

	savedDonation, err := ProcessDonation(donation)
	if err != nil {
		t.Errorf("Expected no error for long details, got %v", err)
	}

	if savedDonation.Details != longDetails {
		t.Errorf("Expected long details to be saved, got %v", savedDonation.Details)
	}

	// Clean up
	database.DB.Unscoped().Delete(&models.Donation{}, "id = ?", savedDonation.ID)
	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder.ID)
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

func TestProcessDonation_ValidMedicine(t *testing.T) {
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
		Type:    "medicine",
		Details: "First aid kit",
		OrderID: savedOrder.ID,
	}

	savedDonation, err := ProcessDonation(donation)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if savedDonation.Type != "medicine" || savedDonation.Details != "First aid kit" {
		t.Errorf("Expected medicine donation, got %v", savedDonation)
	}

	// Clean up
	database.DB.Unscoped().Delete(&models.Donation{}, "id = ?", savedDonation.ID)
	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder.ID)
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}

func TestProcessDonation_ValidClothing(t *testing.T) {
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
		Type:    "clothing",
		Details: "Winter jackets",
		OrderID: savedOrder.ID,
	}

	savedDonation, err := ProcessDonation(donation)
	if err != nil {
		t.Errorf("Expected no error, got %v", err)
	}

	if savedDonation.Type != "clothing" || savedDonation.Details != "Winter jackets" {
		t.Errorf("Expected clothing donation, got %v", savedDonation)
	}

	// Clean up
	database.DB.Unscoped().Delete(&models.Donation{}, "id = ?", savedDonation.ID)
	database.DB.Unscoped().Delete(&models.Order{}, "id = ?", savedOrder.ID)
	database.DB.Unscoped().Delete(&models.User{}, "id = ?", savedUser.ID)
}
package integration

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"testing"

	"backend_go/config"
	"backend_go/database"
	"backend_go/handlers"
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

	// Run tests
	m.Run()
}

func setupIntegrationTestDB() *gorm.DB {
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

func TestIntegration_ValidDonation(t *testing.T) {
	database.DB = setupIntegrationTestDB()

	// Creating a new donation request
	donation := models.Donation{
		Type:    "food",
		Details: "Canned goods",
	}

	jsonData, err := json.Marshal(donation)
	if err != nil {
		t.Fatalf("Failed to marshal donation: %v", err)
	}

	req, err := http.NewRequest("POST", "/donations", bytes.NewBuffer(jsonData))
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(handlers.CreateDonation)
	handler.ServeHTTP(rr, req)

	// Check the status code is 200 OK
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("Handler returned wrong status code: got %v, want %v", status, http.StatusOK)
	}

	// Check the response body
	var savedDonation models.Donation
	err = json.NewDecoder(rr.Body).Decode(&savedDonation)
	if err != nil {
		t.Errorf("Failed to decode response body: %v", err)
	}

	// Ensure the donation was saved with the correct type and details
	if savedDonation.Type != "food" || savedDonation.Details != "Canned goods" {
		t.Errorf("Expected donation with type 'food' and details 'Canned goods', got %v", savedDonation)
	}

	// Clean up
	database.DB.Unscoped().Delete(&models.Donation{}, "id = ?", savedDonation.ID)
}

func TestIntegration_InvalidDonation(t *testing.T) {
	database.DB = setupIntegrationTestDB()

	// Creating a new donation request with missing fields
	donation := models.Donation{
		Type:    "",
		Details: "",
	}

	jsonData, err := json.Marshal(donation)
	if err != nil {
		t.Fatalf("Failed to marshal donation: %v", err)
	}

	req, err := http.NewRequest("POST", "/donations", bytes.NewBuffer(jsonData))
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(handlers.CreateDonation)
	handler.ServeHTTP(rr, req)

	// Check the status code is 500 Internal Server Error
	if status := rr.Code; status != http.StatusInternalServerError {
		t.Errorf("Handler returned wrong status code: got %v, want %v", status, http.StatusInternalServerError)
	}

	// Clean up
	database.DB.Exec("DELETE FROM donations")
}

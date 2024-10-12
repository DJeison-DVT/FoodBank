package integration

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/DJeison-DVT/FoodBank/database"
	"github.com/DJeison-DVT/FoodBank/handlers"
	"github.com/DJeison-DVT/FoodBank/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func setupIntegrationTestDB() *gorm.DB {
	dsn := "postgresql://postgres:<password>@localhost:5432/testdb?sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
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

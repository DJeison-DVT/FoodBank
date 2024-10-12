package handlers

import (
	"testing"

	"github.com/DJeison-DVT/FoodBank/config"
	"github.com/DJeison-DVT/FoodBank/database"
	"github.com/DJeison-DVT/FoodBank/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func setupTestDB() *gorm.DB {
	dsn := config.DatabaseURL
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect to test database")
	}

	db.AutoMigrate(&models.Donation{})
	return db
}

func TestProcessDonation_ValidData(t *testing.T) {
	database.DB = setupTestDB()

	donation := &models.Donation{
		Type:    "food",
		Details: "Canned goods",
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
}

func TestProcessDonation_InvalidData(t *testing.T) {
	database.DB = setupTestDB()

	donation := &models.Donation{}

	_, err := ProcessDonation(donation)
	if err == nil {
		t.Errorf("Expected an error, got none")
	}
}

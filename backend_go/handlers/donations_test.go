package handlers

import (
	"fmt"
	"log"
	"path/filepath"
	"testing"

	"backend_go/config"
	"backend_go/database"
	"backend_go/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"strings"
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

func TestProcessDonation(t *testing.T) {

	t.Run("valid data", func(t *testing.T) {
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
	})

	t.Run("invalid data", func(t *testing.T) {
		database.DB = setupTestDB()

		donation := &models.Donation{}

		_, err := ProcessDonation(donation)
		if err == nil {
			t.Errorf("Expected an error, got none")
		}
	})

	t.Run("extra: missing details", func(t *testing.T) {
		database.DB = setupTestDB()

		donation := &models.Donation{
			Type: "medicine",
		}
		_, err := ProcessDonation(donation)
		if err == nil {
			t.Errorf("Expected error due to missing details, got none")
		}
	})

	t.Run("extra: empty type", func(t *testing.T) {
		database.DB = setupTestDB()

		donation := &models.Donation{
			Type:    "",
			Details: "Blankets",
		}
		_, err := ProcessDonation(donation)
		if err == nil {
			t.Errorf("Expected error due to missing type, got none")
		}
	})

	t.Run("extra: very long details", func(t *testing.T) {
		database.DB = setupTestDB()

		longDetails := "A" + strings.Repeat("B", 5000)
		donation := &models.Donation{
			Type:    "food",
			Details: longDetails,
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
	})

	t.Run("extra: valid medicine", func(t *testing.T) {
		database.DB = setupTestDB()

		donation := &models.Donation{
			Type:    "medicine",
			Details: "First aid kit",
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
	})

	t.Run("extra: valid clothing", func(t *testing.T) {
		database.DB = setupTestDB()

		donation := &models.Donation{
			Type:    "clothing",
			Details: "Winter jackets",
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
	})

}

// Get

func TestRetrieveDonation(t *testing.T) {

	t.Run("valid id", func(t *testing.T) {
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

		if err != nil {
			t.Errorf("Expected no error, got %v", err)
		}

		retrievedDonation, err := RetrieveDonation(savedDonation.ID)
		if err != nil {
			t.Errorf("Expected no error, got %v", err)
		}
		if 	retrievedDonation.Type != savedDonation.Type || 
			retrievedDonation.Details != savedDonation.Details || 
			retrievedDonation.OrderID != savedDonation.OrderID {
			t.Errorf("Expected donations to match, got %v and %v", retrievedDonation, savedDonation)
		}

		// Clean up
		database.DB.Unscoped().Delete(&models.Donation{}, "id = ?", savedDonation.ID)
	})
	t.Run("valid id", func(t *testing.T) {
		database.DB = setupTestDB()

		const fakeID = 40

		retrievedDonation, err := RetrieveDonation(fakeID)
		if err == nil {
			t.Errorf("Expected error due to invalid id, got none")
		}
		if retrievedDonation != nil {
			t.Errorf("Expected nil as data recovered, got %v", retrievedDonation)
		}
	})
}	

// Delete

func TestDropDonation(t *testing.T) {

	t.Run("valid id", func(t *testing.T) {
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

		if err != nil {
			t.Errorf("Expected no error, got %v", err)
		}
		deletedDonation, err := DropDonation(savedDonation.ID)
		if err != nil {
			t.Errorf("Expected no error, got %v", err)
		}
		if deletedDonation != savedDonation.ID {
			t.Errorf("Expected IDs to match, got %v and %v", deletedDonation, savedDonation.ID)
		}

		// Clean up
		database.DB.Unscoped().Delete(&models.Donation{}, "id = ?", savedDonation.ID)
	})
	t.Run("invalid id", func(t *testing.T) {
		database.DB = setupTestDB()

		const fakeID = 40

		_, err := DropDonation(fakeID)
		// golang returns error as nil even if it did not deleted anything because it means what you wanted to happen is happening.
		if err != nil {
			t.Errorf("Expected no error, got %v", err)
		}
	})
}	
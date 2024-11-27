package database

import (
	"log"

	"backend_go/config"
	"backend_go/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	var err error
	DB, err = gorm.Open(postgres.Open(config.DatabaseURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
	}

	ApplicationModels := []interface{}{
		&models.User{},      // Independent model
		&models.Order{},     // Depends on User
		&models.Donation{},  // Depends on Order
		&models.UserToken{}, // Independent model
	}

	DB.AutoMigrate(ApplicationModels...)
	if err != nil {
		log.Fatalf("Failed to apply migrations: %v", err)
	}

	log.Println("Connected to the database and applied migrations successfully.")
}

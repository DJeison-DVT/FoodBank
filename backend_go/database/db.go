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

	DB.AutoMigrate(&models.Donation{})
	DB.AutoMigrate(&models.User{})
	DB.AutoMigrate(&models.UserToken{})

	log.Println("Connected to the database and applied migrations successfully.")
}

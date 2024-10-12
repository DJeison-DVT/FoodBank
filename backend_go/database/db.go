package database

import (
	"log"

	"github.com/DJeison-DVT/FoodBank/config"
	"github.com/DJeison-DVT/FoodBank/models"
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

	log.Println("Connected to the database and applied migrations successfully.")
}

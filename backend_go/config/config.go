package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var (
	DatabaseURL        string
	GoogleClientID     string
	GoogleClientSecret string
	GoogleRedirectURL  string
)

func LoadConfig(envPath string) error {
	var err error

	cwd, _ := os.Getwd()
	log.Printf("Current working directory: %s", cwd)

	if envPath == "" {
		err = godotenv.Load()
	} else {
		err = godotenv.Load(envPath)
	}

	if err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	}

	// Assign values to global variables
	DatabaseURL = os.Getenv("DATABASE_URL")
	GoogleClientID = os.Getenv("GOOGLE_CLIENT_ID")
	GoogleClientSecret = os.Getenv("GOOGLE_CLIENT_SECRET")
	GoogleRedirectURL = os.Getenv("GOOGLE_REDIRECT_URL")

	return nil
}

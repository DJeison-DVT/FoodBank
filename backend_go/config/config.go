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
	S3Endpoint		   string
	S3Bucket		   string
	S3AccessKey		   string
	S3SecretKey		   string
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
	S3Endpoint = os.Getenv("S3_ENDPOINT")
	S3Bucket = os.Getenv("S3_BUCKET")
	S3AccessKey = os.Getenv("S3_ACCESS_KEY")
	S3SecretKey = os.Getenv("S3_SECRET_KEY")

	return nil
}

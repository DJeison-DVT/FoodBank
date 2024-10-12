package config

import (
	"os"
)

var (
	GoogleClientID     = os.Getenv("GOOGLE_CLIENT_ID")
	GoogleClientSecret = os.Getenv("GOOGLE_CLIENT_SECRET")
	GoogleRedirectURL  = os.Getenv("GOOGLE_REDIRECT_URL")
)

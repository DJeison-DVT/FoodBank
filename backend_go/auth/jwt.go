package auth

import (
	"backend_go/models"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

var jwtSecretKey = []byte("your_secret_key")

// GenerateJWT generates a JWT token for a user with a 30-day expiration
func GenerateJWT(user models.User) (string, error) {
	expirationTime := time.Now().Add(30 * 24 * time.Hour)

	// Create the claims (payload) for the token
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"exp":     expirationTime.Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString(jwtSecretKey)
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

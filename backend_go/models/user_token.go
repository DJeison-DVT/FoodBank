package models

import (
	"fmt"
	"strconv"
	"time"

	"gorm.io/gorm"
)

type UserToken struct {
	gorm.Model
	UserID    string    `json:"user_id"`      // Foreign key to User.ID
	Token     string    `json:"access_token"` // Access token
	TokenType string    `json:"token_type"`   // Token type
	IssuedAt  time.Time `json:"issued_at"`    // Issued time converted to time.Time
	ExpiresAt time.Time `json:"expires_at"`   // Calculated expiration time
}

func NewUserToken(userID string, tokenMap map[string]string) (*UserToken, error) {
	requiredFields := []string{"access_token", "expires_in", "issued_at", "token_type"}

	for _, field := range requiredFields {
		value, ok := tokenMap[field]
		if !ok || value == "" {
			return nil, fmt.Errorf("missing or invalid '%s'", field)
		}
	}

	issuedAtUnix, err := strconv.ParseInt(tokenMap["issued_at"], 10, 64)
	if err != nil {
		return nil, err
	}
	issuedAt := time.Unix(issuedAtUnix, 0)

	expiresInSeconds, err := strconv.Atoi(tokenMap["expires_in"])
	if err != nil {
		return nil, err
	}
	expiresAt := issuedAt.Add(time.Duration(expiresInSeconds) * time.Second)

	return &UserToken{
		UserID:    userID,
		Token:     tokenMap["access_token"],
		TokenType: tokenMap["token_type"],
		IssuedAt:  issuedAt,
		ExpiresAt: expiresAt,
	}, nil
}

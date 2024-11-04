package models

import (
	"fmt"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	ID      string `json:"id" gorm:"primaryKey"` // Primary key, using Google-provided user ID
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
	Role    string `json:"role"`
	Address string `json:"address"`
}

func NewUser(userInfo map[string]interface{}) (User, error) {
	requiredFields := map[string]*string{
		"id":      nil,
		"email":   nil,
		"name":    nil,
		"picture": nil,
	}

	for field := range requiredFields {
		value, ok := userInfo[field].(string)
		if !ok || value == "" {
			return User{}, fmt.Errorf("missing or invalid '%s'", field)
		}
		// Set the value in the map
		requiredFields[field] = &value
	}

	// Return a new User instance using validated fields from requiredFields
	return User{
		ID:      *requiredFields["id"],
		Email:   *requiredFields["email"],
		Name:    *requiredFields["name"],
		Picture: *requiredFields["picture"],
		Role:    "user",
		Address: "",
	}, nil
}

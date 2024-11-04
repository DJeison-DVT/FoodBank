package services

import (
	"backend_go/database"
	"backend_go/models"
	"errors"
	"log"
	"time"

	"gorm.io/gorm"
)

func AccessTokenIsValid(token models.UserToken) bool {
	return time.Now().Before(token.ExpiresAt)
}

func GetAccessToken(userID string) (models.UserToken, error) {
	var userToken models.UserToken
	if err := database.DB.Where("user_id = ?", userID).First(&userToken).Error; err != nil {
		return models.UserToken{}, err
	}
	return userToken, nil
}

func RegisterAccessToken(user models.User, formFields map[string]string) (models.UserToken, error) {
	user, err := GetUser(user.ID)
	if err != nil {
		return models.UserToken{}, err
	}

	userToken, err := models.NewUserToken(user.ID, formFields)
	if err != nil {
		return models.UserToken{}, err
	}

	var existingToken models.UserToken
	if err := database.DB.Where("user_id = ?", user.ID).First(&existingToken).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			if err := database.DB.Create(&userToken).Error; err != nil {
				log.Printf("Failed to create user token: %v", err)
				return models.UserToken{}, err
			}
			return existingToken, nil
		}
		return models.UserToken{}, err
	} else {
		existingToken.Token = userToken.Token
		existingToken.TokenType = userToken.TokenType
		existingToken.IssuedAt = userToken.IssuedAt
		existingToken.ExpiresAt = userToken.ExpiresAt

		if err := database.DB.Save(&existingToken).Error; err != nil {
			return models.UserToken{}, err
		}
	}

	if !AccessTokenIsValid(existingToken) {
		log.Println("Access token is invalid")
		// return errors.New("Access token is invalid")
	}

	return existingToken, nil
}

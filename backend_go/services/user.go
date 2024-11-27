package services

import (
	"backend_go/database"
	"backend_go/models"
	"errors"
	"log"

	"gorm.io/gorm"
)

var ErrUserNotFound = errors.New("user not found")

func GetUser(id string) (models.User, error) {
	var user models.User
	if err := database.DB.First(&user, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return models.User{}, ErrUserNotFound
		}
		return models.User{}, err
	}
	return user, nil
}

func CreateUser(userInfo map[string]interface{}) (models.User, error) {
	user, err := models.NewUser(userInfo)
	if err != nil {
		return models.User{}, err
	}
	if err := database.DB.Create(&user).Error; err != nil {
		log.Printf("Failed to create user: %v", err)
		return models.User{}, err
	}
	return user, nil
}

func UpdateUser(user models.User) error {
	if err := database.DB.Save(&user).Error; err != nil {
		log.Printf("Failed to update user: %v", err)
		return err
	}
	return nil
}

func UpsertUser(userInfo map[string]interface{}) (models.User, error) {
	user, err := GetUser(userInfo["id"].(string))
	if err != nil {
		if errors.Is(err, ErrUserNotFound) {
			return CreateUser(userInfo)
		}
		return models.User{}, err
	}
	user.Email = userInfo["email"].(string)
	user.Name = userInfo["name"].(string)
	user.Picture = userInfo["picture"].(string)

	if err := database.DB.Save(&user).Error; err != nil {
		log.Printf("Failed to update user: %v", err)
		return models.User{}, err
	}

	return user, nil
}

func UpdateUserPickupDetails(user models.User, address, details string) (models.User, error) {
	user.Address = address
	user.PickupDetails = details

	if err := database.DB.Save(&user).Error; err != nil {
		log.Printf("Failed to update user pickup details: %v", err)
		return models.User{}, err
	}

	return user, nil
}

func MakeStaff(user models.User) (models.User, error) {
	user.Role = "staff"
	if err := database.DB.Save(&user).Error; err != nil {
		log.Printf("Failed to update user role: %v", err)
		return models.User{}, err
	}
	return user, nil
}

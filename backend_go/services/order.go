package services

import (
	"backend_go/database"
	"backend_go/models"

	"gorm.io/gorm"

	"crypto/rand"
	"encoding/base64"
	"golang.org/x/crypto/bcrypt"

	"fmt"
)

func GetOrder(orderID uint) (models.Order, error) {
	var order models.Order
	if err := database.DB.First(&order, orderID).Error; err != nil {
		return order, err
	}

	return order, nil
}

func getPendingOrdersByStatus(status models.OrderStatus) ([]models.Order, error) {
	var orders []models.Order

	if err := database.DB.Where("status = ?", status).Find(&orders).Error; err != nil {
		return nil, err
	}

	return orders, nil
}

func GetVerificationPendingOrders() ([]models.Order, error) {
	return getPendingOrdersByStatus(models.StatusNeedsToBeVerified)
}

func GetSchedulePendingOrders() ([]models.Order, error) {
	return getPendingOrdersByStatus(models.StatusVerified)
}

func GetPickupPendingOrders() ([]models.Order, error) {
	return getPendingOrdersByStatus(models.StatusScheduled)
}

func CreateOrder(userID string) (models.Order, error) {
	order := models.Order{
		UserID: userID,
		Status: models.StatusBeingModified,
	}

	if err := database.DB.Create(&order).Error; err != nil {
		return order, err
	}

	return order, nil
}

func GetUserActiveOrder(userID string) (models.Order, error) {
	var order models.Order

	err := database.DB.
		Preload("Donations"). // Preloads the Donations relationship
		Where("user_id = ? AND status != ?", userID, models.StatusPickedUp).
		First(&order).Error

	if err != nil {
		return models.Order{}, err
	}
	
	return order, nil
}

func GetCompletedOrders(userId string) ([]models.Order, error) {
	var orders []models.Order

	query := database.DB.Preload("Donations")

	if userId != "" {
		query = query.Where("user_id = ?", userId)
	}

	if err := query.Where("status = ?", models.StatusPickedUp).Find(&orders).Error; err != nil {
		return orders, err
	}

	return orders, nil
}

func RejectOrder(order *models.Order, donationIDs []uint) error {
	return database.DB.Transaction(func(tx *gorm.DB) error {
		order.Status = models.StatusNeedsToBeChecked
		if err := updateOrder(tx, order); err != nil {
			return err
		}

		if err := RejectDonations(tx, donationIDs); err != nil {
			return err
		}

		return nil
	})
}

func updateOrder(tx *gorm.DB, order *models.Order) error {
	if err := tx.Save(order).Error; err != nil {
		return err
	}
	return nil
}

func generateToken(length int) (string, error) {
	bytes := make([]byte, length)
	_, err := rand.Read(bytes)
	if err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(bytes), nil
}

func hashToken(token string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(token), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashed), nil
}

func verifyToken(hashedToken, token string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedToken), []byte(token))
	return err == nil
}

func VerifyOrder(order *models.Order) error {
	return database.DB.Transaction(func(tx *gorm.DB) error {
		order.Status = models.StatusVerified

		// token, err := generateToken(32)
		// if err != nil {
		// 	fmt.Println("Error generating token:", err)
		// 	return err
		// }

		hashed, err := hashToken(order.UserID)
		if err != nil {
			fmt.Println("Error hashing token:", err)
			return err
		}

		order.VerificationQRCode = hashed

		if err := updateOrder(tx, order); err != nil {
			return err
		}

		if err := VerifyOrderDonations(tx, order); err != nil {
			return err
		}

		return nil
	})
}

func ScheduleOrder(order *models.Order, pickupDate, pickupTime string) error {
	return database.DB.Transaction(func(tx *gorm.DB) error {
		order.Status = models.StatusScheduled
		order.PickupDate = pickupDate
		order.PickupTime = pickupTime
		if err := updateOrder(tx, order); err != nil {
			return err
		}

		return nil
	})
}

func UpdateOrderStatus(order *models.Order, status models.OrderStatus) error {
	order.Status = status
	if err := updateOrder(database.DB, order); err != nil {
		return err
	}
	return nil
}

func HasRejectedDonations(order *models.Order) bool {
	donations, err := GetOrderDonations(order.ID)
	if err != nil {
		return false
	}

	for _, donation := range donations {
		if donation.Status == models.StatusRejected {
			return true
		}
	}
	return false
}

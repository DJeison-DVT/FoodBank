package services

import (
	"backend_go/database"
	"backend_go/models"

	"gorm.io/gorm"
)

func GetOrder(orderID uint) (models.Order, error) {
	var order models.Order
	if err := database.DB.First(&order, orderID).Error; err != nil {
		return order, err
	}

	return order, nil
}

func GetVerificationPendingOrders() ([]models.Order, error) {
	var orders []models.Order

	if err := database.DB.Preload("Donations").Where("orders.status = ?", models.StatusNeedsToBeVerified).
		Find(&orders).Error; err != nil {
		return nil, err
	}

	return orders, nil
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

func GetUserActiveOrder(userID string) (models.Order, []models.Donation, error) {
	var order models.Order
	var donations []models.Donation

	err := database.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("user_id = ? AND status != ?", userID, models.StatusPickedUp).
			First(&order).Error; err != nil {
			return err
		}

		if err := tx.Where("order_id = ?", order.ID).Find(&donations).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return models.Order{}, nil, err
	}

	return order, donations, nil
}

func GetCompletedOrders(userId string) ([]models.Order, error) {
	var orders []models.Order
	if err := database.DB.Where("status = ?", models.StatusPickedUp).Find(&orders).Error; err != nil {
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

// TODO link qr code to order here
func VerifyOrder(order *models.Order) error {
	return database.DB.Transaction(func(tx *gorm.DB) error {
		order.Status = models.StatusVerified
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

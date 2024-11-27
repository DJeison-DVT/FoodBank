package services

import (
	"backend_go/database"
	"backend_go/models"
	"encoding/json"
	"errors"
	"net/http"

	"gorm.io/gorm"
)

func GetPresignedURL(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8081")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	userID := r.URL.Query().Get("id")
	user, err := GetUser(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(user)
}

func ProcessDonation(donation *models.Donation) (*models.Donation, error) {
	if donation.Type == "" || donation.Details == "" {
		return nil, errors.New("invalid donation data")
	}

	if err := database.DB.Create(donation).Error; err != nil {
		return nil, err
	}

	return donation, nil
}

func GetOrderDonations(orderID uint) ([]models.Donation, error) {
	var donations []models.Donation
	if err := database.DB.Where("order_id = ?", orderID).Find(&donations).Error; err != nil {
		return donations, err
	}

	return donations, nil
}

func VerifyOrderDonations(tx *gorm.DB, order *models.Order) error {
	var donations []models.Donation
	if err := tx.Where("order_id = ?", order.ID).Find(&donations).Error; err != nil {
		return err
	}

	for _, donation := range donations {
		donation.Status = models.StatusApproved
		if err := tx.Save(&donation).Error; err != nil {
			return err
		}
	}

	return nil
}

func RejectDonations(tx *gorm.DB, donationIDs []uint) error {
	if err := tx.Model(&models.Donation{}).
		Where("id IN ?", donationIDs).
		Update("status", models.StatusRejected).Error; err != nil {
		return err
	}
	return nil
}

func GetDonation(donationID uint) (models.Donation, error) {
	var donation models.Donation
	if err := database.DB.First(&donation, donationID).Error; err != nil {
		return donation, err
	}

	return donation, nil
}

func DeleteDonation(donationID uint) error {
	if err := database.DB.Delete(&models.Donation{}, donationID).Error; err != nil {
		return err
	}
	return nil
}

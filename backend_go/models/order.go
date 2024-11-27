package models

import (
	"gorm.io/gorm"
)

type Order struct {
	gorm.Model
	UserID             string      `json:"user_id"` // Foreign key linking to User
	Status             OrderStatus `json:"status" gorm:"default:BeingModified"`
	Donations          []Donation  `json:"donations"`
	VerificationQRCode string
	PickupDate         string
	PickupTime         string
}

type OrderStatus string

const (
	StatusBeingModified     OrderStatus = "BeingModified"     // Initial status
	StatusNeedsToBeChecked  OrderStatus = "NeedsToBeChecked"  // Donations are invalid
	StatusNeedsToBeVerified OrderStatus = "NeedsToBeVerified" // Waiting for staff verification
	StatusVerified          OrderStatus = "Verified"          // Approved
	StatusScheduled         OrderStatus = "Scheduled"         // Pickup scheduled
	StatusPickedUp          OrderStatus = "PickedUp"          // Items collected, Order completed
)

func NewOrder(userID string) (Order, error) {
	newOrder := Order{
		UserID: userID,
	}

	return newOrder, nil
}

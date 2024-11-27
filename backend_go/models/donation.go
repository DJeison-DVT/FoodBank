package models

import (
	"encoding/json"

	"gorm.io/gorm"
)

type Donation struct {
	gorm.Model
	Type    string
	Details string
	Images  json.RawMessage `gorm:"type:jsonb"`
	OrderID uint
	Status  DonationStatus `gorm:"default:Pending"`
}

type DonationStatus string

const (
	StatusPending  DonationStatus = "Pending" // Initial status
	StatusApproved DonationStatus = "Approved"
	StatusRejected DonationStatus = "Rejected"
)

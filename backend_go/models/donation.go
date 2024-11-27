package models

import (
	"encoding/json"

	"gorm.io/gorm"
)

type Donation struct {
	gorm.Model
	Type    string          `json:"type" gorm:"not null"`
	Details string          `json:"details" gorm:"not null"`
	Images  json.RawMessage `json:"images" gorm:"type:jsonb"`
	OrderID uint            `json:"order_id" gorm:"not null;index"`
	Status  DonationStatus  `json:"status" gorm:"default:Pending"`
}

type DonationStatus string

const (
	StatusPending  DonationStatus = "Pending" // Initial status
	StatusApproved DonationStatus = "Approved"
	StatusRejected DonationStatus = "Rejected"
)

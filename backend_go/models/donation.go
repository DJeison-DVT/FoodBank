package models

import (
	"gorm.io/gorm"
) 

type Donation struct {
	gorm.Model
	Type    string
	Details string
	Images  []string `gorm:"type:jsonb"`
	OrderID uint
}


package models

import "gorm.io/gorm"

type Donation struct {
	gorm.Model
	Type    string
	Details string
	OrderID uint
}

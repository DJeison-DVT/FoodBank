package models

import (
	"gorm.io/gorm"
	"encoding/json"
) 

type Donation struct {
	gorm.Model
	Type    string
	Details string
	Images  json.RawMessage `gorm:"type:jsonb"`
	OrderID uint
}


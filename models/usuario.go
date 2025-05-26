package models

import "time"

type Usuario struct {
	ID           uint `gorm:"primaryKey"`
	Nombre       string
	Email        string `gorm:"unique"`
	PasswordHash string `json:"-"`
	Rol          string
	FechaAlta    time.Time
}

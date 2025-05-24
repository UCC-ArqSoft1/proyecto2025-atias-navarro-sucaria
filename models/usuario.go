package models

import "time"

type Usuario struct {
	ID        uint `gorm:"primaryKey"`
	Nombre    string
	Email     string `gorm:"unique"`
	Password  string
	Rol       string
	FechaAlta time.Time
}

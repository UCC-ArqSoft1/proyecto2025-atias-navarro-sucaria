package models

import (
	"time"
)

type Inscripcion struct {
	ID            uint `gorm:"primaryKey"`
	UsuarioID     uint
	ActividadID   uint
	FechaRegistro time.Time
}

func (Inscripcion) TableName() string {
	return "inscripciones"
}

package services

import (
	"time"

	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/db"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/dto"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/models"
)

func CrearInscripcion(usuarioID uint, input dto.CreateInscripcionDTO) error {
	inscripcion := models.Inscripcion{
		UsuarioID:     usuarioID,
		ActividadID:   input.ActividadID,
		FechaRegistro: time.Now(),
	}

	return db.DB.Create(&inscripcion).Error
}

func ObtenerActividadesPorUsuarioID(usuarioID uint) ([]models.Actividad, error) {
	var actividades []models.Actividad

	err := db.DB.
		Table("actividades").
		Select("actividades.*").
		Joins("inner join inscripciones on inscripciones.actividad_id = actividades.id").
		Where("inscripciones.usuario_id = ?", usuarioID).
		Find(&actividades).Error

	return actividades, err
}

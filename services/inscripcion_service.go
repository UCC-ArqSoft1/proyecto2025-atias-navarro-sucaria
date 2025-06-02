package services

import (
	"errors"
	"time"

	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/db"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/dto"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/models"
)

func CrearInscripcion(usuarioID uint, input dto.CreateInscripcionDTO) error {
	var existente models.Inscripcion
	err := db.DB.Where("usuario_id = ? AND actividad_id = ?", usuarioID, input.ActividadID).
		First(&existente).Error

	if err == nil {
		return errors.New("ya estás inscripto en esta actividad")
	}

	var actividad models.Actividad
	err = db.DB.First(&actividad, input.ActividadID).Error
	if err != nil {
		return errors.New("actividad no encontrada")
	}

	var cantidadInscriptos int64
	db.DB.Model(&models.Inscripcion{}).
		Where("actividad_id = ?", input.ActividadID).
		Count(&cantidadInscriptos)

	if int(cantidadInscriptos) >= actividad.Cupo {
		return errors.New("el cupo de la actividad ya está completo")
	}

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
		Table("actividads").
		Select("actividads.*").
		Joins("inner join inscripciones on inscripciones.actividad_id = actividads.id").
		Where("inscripciones.usuario_id = ?", usuarioID).
		Find(&actividades).Error

	return actividades, err
}

func ObtenerInscriptosPorActividadID(actividadID string) ([]models.Usuario, error) {
	var usuarios []models.Usuario

	err := db.DB.
		Table("usuarios").
		Select("usuarios.*").
		Joins("inner join inscripciones on inscripciones.usuario_id = usuarios.id").
		Where("inscripciones.actividad_id = ?", actividadID).
		Find(&usuarios).Error

	return usuarios, err
}

func EliminarInscripcionPorID(id string) error {
	return db.DB.Where("id = ?", id).Delete(&models.Inscripcion{}).Error
}

// ✅ NUEVO: Verifica si un usuario está inscripto a una actividad
func EstaInscripto(usuarioID, actividadID uint) (bool, error) {
	var inscripcion models.Inscripcion
	err := db.DB.
		Where("usuario_id = ? AND actividad_id = ?", usuarioID, actividadID).
		First(&inscripcion).Error

	if err != nil {
		return false, nil // No encontrado no es error
	}
	return true, nil
}

func EliminarInscripcion(usuarioID uint, actividadID string) error {
	return db.DB.Where("usuario_id = ? AND actividad_id = ?", usuarioID, actividadID).
		Delete(&models.Inscripcion{}).Error
}

package services

import (
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/db"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/dto"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/models"
)

func CrearActividad(input dto.CreateActividadDTO) (models.Actividad, error) {
	actividad := models.Actividad{
		Titulo:      input.Titulo,
		Descripcion: input.Descripcion,
		Dia:         input.Dia,
		Horario:     input.Horario,
		Duracion:    input.Duracion,
		Cupo:        input.Cupo,
		Categoria:   input.Categoria,
		Instructor:  input.Instructor,
	}
	err := db.DB.Create(&actividad).Error
	return actividad, err
}

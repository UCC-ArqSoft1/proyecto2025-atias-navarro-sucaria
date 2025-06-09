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
		Imagen:      input.Imagen,
	}
	err := db.DB.Create(&actividad).Error
	return actividad, err
}

func ObtenerActividades() ([]models.Actividad, error) {
	var actividades []models.Actividad
	err := db.DB.Find(&actividades).Error
	return actividades, err
}

func ObtenerActividadPorID(id string) (models.Actividad, error) {
	var actividad models.Actividad
	err := db.DB.First(&actividad, id).Error
	return actividad, err
}

func ActualizarActividad(id string, input dto.CreateActividadDTO) error {
	var actividad models.Actividad

	if err := db.DB.First(&actividad, id).Error; err != nil {
		return err
	}

	actividad.Titulo = input.Titulo
	actividad.Descripcion = input.Descripcion
	actividad.Dia = input.Dia
	actividad.Horario = input.Horario
	actividad.Duracion = input.Duracion
	actividad.Cupo = input.Cupo
	actividad.Categoria = input.Categoria
	actividad.Instructor = input.Instructor
	actividad.Imagen = input.Imagen

	return db.DB.Save(&actividad).Error
}

func EliminarActividadPorID(id string) error {
	return db.DB.Where("id = ?", id).Delete(&models.Actividad{}).Error
}

func FiltrarActividades(clave, dia, horario string) ([]models.Actividad, error) {
	var actividades []models.Actividad
	query := db.DB.Model(&models.Actividad{})

	if clave != "" {
		query = query.Where("titulo LIKE ? OR descripcion LIKE ?", "%"+clave+"%", "%"+clave+"%")
	}
	if dia != "" {
		query = query.Where("dia = ?", dia)
	}
	if horario != "" {
		query = query.Where("horario = ?", horario)
	}

	err := query.Find(&actividades).Error
	return actividades, err
}

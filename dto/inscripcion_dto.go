package dto

type CreateInscripcionDTO struct {
	ActividadID uint `json:"actividad_id" binding:"required"`
}

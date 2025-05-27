package dto

type CreateActividadDTO struct {
	Titulo      string `json:"titulo" binding:"required"`
	Descripcion string `json:"descripcion" binding:"required"`
	Dia         string `json:"dia" binding:"required"`      // ej: "lunes"
	Horario     string `json:"horario" binding:"required"`  // formato: "18:00"
	Duracion    int    `json:"duracion" binding:"required"` // minutos
	Cupo        int    `json:"cupo" binding:"required"`
	Categoria   string `json:"categoria" binding:"required"`
	Instructor  string `json:"instructor" binding:"required"`
}

package models

type Actividad struct {
	ID          uint `gorm:"primaryKey"`
	Titulo      string
	Descripcion string
	Dia         string
	Horario     string
	Duracion    int
	Cupo        int
	Categoria   string
	Instructor  string
}

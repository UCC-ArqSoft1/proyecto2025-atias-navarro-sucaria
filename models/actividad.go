package models

type Actividad struct {
	ID          uint   `json:"id"`
	Titulo      string `json:"titulo"`
	Descripcion string `json:"descripcion"`
	Dia         string `json:"dia"`
	Horario     string `json:"horario"`
	Duracion    int    `json:"duracion"`
	Cupo        int    `json:"cupo"`
	Categoria   string `json:"categoria"`
	Instructor  string `json:"instructor"`
}

func (Actividad) TableName() string {
	return "actividads"
}

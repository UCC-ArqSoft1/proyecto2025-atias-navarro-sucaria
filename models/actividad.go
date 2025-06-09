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
	Imagen      string `json:"imagen"`
}

func (Actividad) TableName() string {
	return "actividads"
}

type ActividadConInscriptos struct {
	Actividad
	Inscriptos int `json:"inscriptos"`
}

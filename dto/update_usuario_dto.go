package dto

type UpdateUsuarioDTO struct {
	Nombre   string `json:"nombre"`
	Email    string `json:"email"`
	Password string `json:"password"` // opcional
	Rol      string `json:"rol"`
}

package services

import (
	"time"

	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/db"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/dto"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/models"
)

func CrearUsuario(input dto.CreateUsuarioDTO) (models.Usuario, error) {
	usuario := models.Usuario{
		Nombre:    input.Nombre,
		Email:     input.Email,
		Password:  input.Password,
		Rol:       input.Rol,
		FechaAlta: time.Now(),
	}
	err := db.DB.Create(&usuario).Error
	return usuario, err
}

func ObtenerUsuarios() ([]models.Usuario, error) {
	var usuarios []models.Usuario
	err := db.DB.Find(&usuarios).Error
	return usuarios, err
}

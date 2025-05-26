package services

import (
	"fmt"
	"time"

	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/db"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/dto"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/models"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/utils"
)

func CrearUsuario(input dto.CreateUsuarioDTO) (models.Usuario, error) {
	usuario := models.Usuario{
		Nombre:       input.Nombre,
		Email:        input.Email,
		PasswordHash: utils.HashSHA256(input.Password),
		Rol:          input.Rol,
		FechaAlta:    time.Now(),
	}
	err := db.DB.Create(&usuario).Error
	return usuario, err
}

func ObtenerUsuarios() ([]models.Usuario, error) {
	var usuarios []models.Usuario
	err := db.DB.Find(&usuarios).Error
	return usuarios, err
}

func ObtenerUsuariosPorRol(rol string) ([]models.Usuario, error) {
	fmt.Println("DEBUG - Filtro de rol recibido:", rol) // ← esto te va a mostrar qué recibe
	var usuarios []models.Usuario
	err := db.DB.Where("rol = ?", rol).Find(&usuarios).Error
	return usuarios, err
}

func EliminarUsuarioPorID(id string) error {
	return db.DB.Where("id = ?", id).Delete(&models.Usuario{}).Error
}

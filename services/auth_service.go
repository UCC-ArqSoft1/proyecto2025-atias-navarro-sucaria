package services

import (
	"errors"

	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/db"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/dto"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/models"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/utils"
)

func Login(input dto.LoginDTO) (string, error) {
	var usuario models.Usuario

	err := db.DB.Where("email = ?", input.Email).First(&usuario).Error
	if err != nil {
		return "", errors.New("usuario no encontrado")
	}

	passwordHash := utils.HashSHA256(input.Password)

	if usuario.PasswordHash != passwordHash {
		return "", errors.New("contraseña incorrecta")
	}

	token, err := utils.GenerateJWT(int(usuario.ID))
	if err != nil {
		return "", errors.New("error generando token")
	}

	return token, nil
}

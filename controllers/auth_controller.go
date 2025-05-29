package controllers

import (
	"net/http"

	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/dto"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/services"
	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	var input dto.LoginDTO

	// Validar JSON de entrada
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Entrada inválida"})
		return
	}

	// Lógica de login
	token, err := services.Login(input)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// Devolver el token
	c.JSON(http.StatusOK, gin.H{"token": token})
}

func Register(c *gin.Context) {
	var input dto.CreateUsuarioDTO

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "Entrada inválida"})
		return
	}

	// Forzar el rol a "socio"
	input.Rol = "socio"

	usuario, err := services.CrearUsuario(input)
	if err != nil {
		c.JSON(500, gin.H{"error": "No se pudo registrar el usuario"})
		return
	}

	c.JSON(201, gin.H{
		"mensaje": "Registro exitoso",
		"id":      usuario.ID,
		"email":   usuario.Email,
	})
}

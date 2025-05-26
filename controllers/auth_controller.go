package controllers

import (
	"net/http"

	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/services"

	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/dto"

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

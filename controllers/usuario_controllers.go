package controllers

import (
	"net/http"

	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/dto"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/services"
	"github.com/gin-gonic/gin"
)

func GetUsuarios(c *gin.Context) {
	usuarios, err := services.ObtenerUsuarios()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error al obtener usuarios"})
		return
	}
	c.JSON(http.StatusOK, usuarios)
}

func PostUsuario(c *gin.Context) {
	var input dto.CreateUsuarioDTO
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "entrada inválida"})
		return
	}

	usuario, err := services.CrearUsuario(input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo crear usuario"})
		return
	}
	c.JSON(http.StatusCreated, usuario)
}

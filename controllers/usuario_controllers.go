package controllers

import (
	"net/http"

	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/dto"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/services"
	"github.com/gin-gonic/gin"
)

func GetUsuariosPorRol(c *gin.Context) {
	rol := c.Query("rol")

	if rol == "" {
		// Si no hay rol → devuelve todos
		usuarios, err := services.ObtenerUsuarios()
		if err != nil {
			c.JSON(500, gin.H{"error": "Error al obtener usuarios"})
			return
		}
		c.JSON(200, usuarios)
		return
	}

	// Si hay rol → filtra
	usuarios, err := services.ObtenerUsuariosPorRol(rol)
	if err != nil {
		c.JSON(500, gin.H{"error": "Error al filtrar por rol"})
		return
	}
	c.JSON(200, usuarios)
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

func DeleteUsuario(c *gin.Context) {
	id := c.Param("id")

	err := services.EliminarUsuarioPorID(id)
	if err != nil {
		c.JSON(500, gin.H{"error": "no se pudo eliminar el usuario"})
		return
	}

	c.JSON(200, gin.H{"mensaje": "usuario eliminado correctamente"})
}

func UpdateUsuario(c *gin.Context) {
	id := c.Param("id")
	var input dto.UpdateUsuarioDTO

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "entrada inválida"})
		return
	}

	err := services.ActualizarUsuario(id, input)
	if err != nil {
		c.JSON(500, gin.H{"error": "no se pudo actualizar el usuario"})
		return
	}

	c.JSON(200, gin.H{"mensaje": "usuario actualizado"})
}

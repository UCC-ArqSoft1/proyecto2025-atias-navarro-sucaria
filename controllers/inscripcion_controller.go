package controllers

import (
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/dto"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/services"
	"github.com/gin-gonic/gin"
)

func PostInscripcion(c *gin.Context) {
	var input dto.CreateInscripcionDTO

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "entrada inválida"})
		return
	}

	// Simulamos usuario ID = 1 por ahora
	usuarioID := uint(1) // después se saca del token

	if err := services.CrearInscripcion(usuarioID, input); err != nil {
		c.JSON(500, gin.H{"error": "no se pudo crear la inscripción"})
		return
	}

	c.JSON(201, gin.H{"mensaje": "inscripción realizada correctamente"})
}

func GetMisActividades(c *gin.Context) {
	// 🔧 Simulamos el usuario logueado con ID 1
	usuarioID := uint(1) // ← acá lo ponés

	actividades, err := services.ObtenerActividadesPorUsuarioID(usuarioID)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, actividades)
}

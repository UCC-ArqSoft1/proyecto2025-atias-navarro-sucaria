package controllers

import (
	"strings"

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

	usuarioID := uint(1) // temporal

	err := services.CrearInscripcion(usuarioID, input)
	if err != nil {
		// Mostrar errores conocidos
		if strings.Contains(err.Error(), "ya estás inscripto") ||
			strings.Contains(err.Error(), "actividad no encontrada") ||
			strings.Contains(err.Error(), "cupo") {
			c.JSON(400, gin.H{"error": err.Error()})
		} else {
			c.JSON(500, gin.H{"error": "no se pudo crear la inscripción"})
		}
		return
	}

	c.JSON(201, gin.H{"mensaje": "inscripción creada correctamente"})
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

func GetInscriptosPorActividad(c *gin.Context) {
	actividadID := c.Param("id")

	usuarios, err := services.ObtenerInscriptosPorActividadID(actividadID)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, usuarios)
}

func DeleteInscripcion(c *gin.Context) {
	id := c.Param("id")

	err := services.EliminarInscripcionPorID(id)
	if err != nil {
		c.JSON(500, gin.H{"error": "No se pudo eliminar la inscripción"})
		return
	}

	c.JSON(200, gin.H{"mensaje": "inscripción cancelada correctamente"})
}

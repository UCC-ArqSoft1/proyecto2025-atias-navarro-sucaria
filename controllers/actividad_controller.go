package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/dto"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/models"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/services"
)

func PostActividad(c *gin.Context) {
	var input dto.CreateActividadDTO
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Entrada inválida"})
		return
	}

	actividad, err := services.CrearActividad(input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})

		return
	}

	c.JSON(http.StatusCreated, actividad)
}

func GetActividades(c *gin.Context) {
	actividades, err := services.ObtenerActividades()
	if err != nil {
		c.JSON(500, gin.H{"error": "No se pudieron obtener las actividades"})
		return
	}
	c.JSON(200, actividades)
}

func GetActividadPorID(c *gin.Context) {
	id := c.Param("id")

	actividad, err := services.ObtenerActividadPorID(id)
	if err != nil {
		c.JSON(404, gin.H{"error": "Actividad no encontrada"})
		return
	}

	c.JSON(200, actividad)
}

func PutActividad(c *gin.Context) {
	id := c.Param("id")
	var input models.Actividad

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "entrada inválida"})
		return
	}

	err := services.ActualizarActividad(id, input)
	if err != nil {
		c.JSON(500, gin.H{"error": "no se pudo actualizar la actividad"})
		return
	}

	c.JSON(200, gin.H{"mensaje": "actividad actualizada correctamente"})
}

func DeleteActividad(c *gin.Context) {
	id := c.Param("id")

	err := services.EliminarActividadPorID(id)
	if err != nil {
		c.JSON(500, gin.H{"error": "No se pudo eliminar la actividad"})
		return
	}

	c.JSON(200, gin.H{"mensaje": "actividad eliminada correctamente"})
}

func FiltrarActividades(c *gin.Context) {
	clave := c.Query("clave")
	categoria := c.Query("categoria")
	horario := c.Query("horario")

	actividades, err := services.FiltrarActividades(clave, categoria, horario)
	if err != nil {
		c.JSON(500, gin.H{"error": "No se pudieron obtener las actividades"})
		return
	}

	c.JSON(200, actividades)
}

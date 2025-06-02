package controllers

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/dto"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/services"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

// POST /inscripciones
func PostInscripcion(c *gin.Context) {
	var input dto.CreateInscripcionDTO

	if err := c.ShouldBindBodyWith(&input, binding.JSON); err != nil {
		fmt.Println("🔴 Error al parsear JSON:", err)
		c.JSON(400, gin.H{"error": "Entrada inválida: " + err.Error()})
		return
	}

	fmt.Printf("📥 JSON recibido: actividad_id = %v (tipo: %T)\n", input.ActividadID, input.ActividadID)

	usuarioID := uint(1) // 🔧 Simulado
	err := services.CrearInscripcion(usuarioID, input)
	if err != nil {
		if strings.Contains(err.Error(), "ya estás inscripto") ||
			strings.Contains(err.Error(), "actividad no encontrada") ||
			strings.Contains(err.Error(), "cupo") {
			c.JSON(400, gin.H{"error": err.Error()})
		} else {
			fmt.Println("🔧 Error interno:", err)
			c.JSON(500, gin.H{"error": "No se pudo crear la inscripción"})
		}
		return
	}

	c.JSON(201, gin.H{"mensaje": "Inscripción creada correctamente"})
}

// GET /mis-actividades
func GetMisActividades(c *gin.Context) {
	usuarioID := uint(1) // 🔧 Simulado
	fmt.Println("👤 Buscando actividades para usuario:", usuarioID)

	actividades, err := services.ObtenerActividadesPorUsuarioID(usuarioID)
	if err != nil {
		fmt.Println("❌ Error al obtener actividades:", err)
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, actividades)
}

// GET /actividades/:id/inscripciones
func GetInscriptosPorActividad(c *gin.Context) {
	actividadID := c.Param("id")

	usuarios, err := services.ObtenerInscriptosPorActividadID(actividadID)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, usuarios)
}

// GET /inscripciones/:id/check
func CheckInscripcion(c *gin.Context) {
	actividadIDStr := c.Param("id")
	actividadID, err := strconv.Atoi(actividadIDStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "ID de actividad inválido"})
		return
	}

	usuarioID := uint(1) // 🔧 Simulado

	inscripto, err := services.EstaInscripto(usuarioID, uint(actividadID))
	if err != nil {
		fmt.Println("❌ Error al verificar inscripción:", err)
		c.JSON(500, gin.H{"error": "No se pudo verificar la inscripción"})
		return
	}

	c.JSON(200, gin.H{"inscripto": inscripto})
}

// DELETE /inscripciones/:id
func DeleteInscripcion(c *gin.Context) {
	usuarioID := uint(1) // 🔧 Simulado
	actividadID := c.Param("id")

	err := services.EliminarInscripcion(usuarioID, actividadID)
	if err != nil {
		fmt.Println("❌ Error al cancelar inscripción:", err)
		c.JSON(500, gin.H{"error": "No se pudo cancelar la inscripción"})
		return
	}

	c.JSON(200, gin.H{"mensaje": "Inscripción cancelada"})
}

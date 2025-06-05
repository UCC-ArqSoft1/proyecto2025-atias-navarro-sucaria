package controllers

import (
	"fmt"
	"strconv"

	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/dto"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/services"
	"github.com/gin-gonic/gin"
)

// POST /inscripciones
func PostInscripcion(c *gin.Context) {
	var input dto.CreateInscripcionDTO

	if err := c.ShouldBindJSON(&input); err != nil {
		fmt.Println("🔴 Error al parsear JSON:", err)
		c.JSON(400, gin.H{"error": "Entrada inválida: " + err.Error()})
		return
	}

	usuarioIDRaw, existe := c.Get("usuarioID")
	if !existe {
		c.JSON(401, gin.H{"error": "Usuario no autenticado"})
		return
	}
	usuarioID, ok := usuarioIDRaw.(uint)
	if !ok {
		c.JSON(500, gin.H{"error": "ID de usuario inválido"})
		return
	}

	fmt.Printf("📥 Inscribiendo usuario %d a actividad %d\n", usuarioID, input.ActividadID)

	err := services.CrearInscripcion(usuarioID, input)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, gin.H{"mensaje": "Inscripción creada correctamente"})
}

// GET /mis-actividades
func GetMisActividades(c *gin.Context) {
	usuarioIDRaw, existe := c.Get("usuarioID")
	if !existe {
		c.JSON(401, gin.H{"error": "Usuario no autenticado"})
		return
	}
	usuarioID, ok := usuarioIDRaw.(uint)
	if !ok {
		c.JSON(500, gin.H{"error": "Error interno al leer el ID del usuario"})
		return
	}

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

	usuarioIDRaw, existe := c.Get("usuarioID")
	if !existe {
		c.JSON(401, gin.H{"error": "Usuario no autenticado"})
		return
	}
	usuarioID, ok := usuarioIDRaw.(uint)
	if !ok {
		c.JSON(500, gin.H{"error": "Error interno al leer el ID del usuario"})
		return
	}

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
	actividadID := c.Param("id")

	usuarioIDRaw, existe := c.Get("usuarioID")
	if !existe {
		c.JSON(401, gin.H{"error": "Usuario no autenticado"})
		return
	}
	usuarioID, ok := usuarioIDRaw.(uint)
	if !ok {
		c.JSON(500, gin.H{"error": "Error interno al leer el ID del usuario"})
		return
	}

	err := services.EliminarInscripcion(usuarioID, actividadID)
	if err != nil {
		fmt.Println("❌ Error al cancelar inscripción:", err)
		c.JSON(500, gin.H{"error": "No se pudo cancelar la inscripción"})
		return
	}

	c.JSON(200, gin.H{"mensaje": "Inscripción cancelada"})
}

package controllers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/dto"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/services"
)

func PostActividad(c *gin.Context) {
	// Verificar autenticación y rol
	if _, existe := c.Get("usuarioID"); !existe {
		fmt.Println("❌ Usuario no autenticado")
		c.JSON(401, gin.H{"error": "Usuario no autenticado"})
		return
	}

	// Verificar rol de administrador
	rolRaw, existe := c.Get("rol")
	if !existe {
		fmt.Println("❌ Rol no encontrado en el token")
		c.JSON(403, gin.H{"error": "Rol no encontrado en el token"})
		return
	}

	rol, ok := rolRaw.(string)
	if !ok {
		fmt.Println("❌ Rol no es un string:", rolRaw)
		c.JSON(403, gin.H{"error": "Rol inválido"})
		return
	}

	if rol != "administrador" {
		fmt.Println("❌ Rol no es administrador:", rol)
		c.JSON(403, gin.H{"error": "No tienes permisos para realizar esta acción"})
		return
	}

	var input dto.CreateActividadDTO
	if err := c.ShouldBindJSON(&input); err != nil {
		fmt.Println("❌ Error al parsear JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Entrada inválida: " + err.Error()})
		return
	}

	fmt.Println("📥 Datos recibidos:", input)

	actividad, err := services.CrearActividad(input)
	if err != nil {
		fmt.Println("❌ Error al crear actividad:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	fmt.Println("✅ Actividad creada:", actividad)
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
	// Verificar autenticación y rol
	if _, existe := c.Get("usuarioID"); !existe {
		fmt.Println("❌ Usuario no autenticado")
		c.JSON(401, gin.H{"error": "Usuario no autenticado"})
		return
	}

	// Verificar rol de administrador
	rolRaw, existe := c.Get("rol")
	if !existe {
		fmt.Println("❌ Rol no encontrado en el token")
		c.JSON(403, gin.H{"error": "Rol no encontrado en el token"})
		return
	}

	rol, ok := rolRaw.(string)
	if !ok {
		fmt.Println("❌ Rol no es un string:", rolRaw)
		c.JSON(403, gin.H{"error": "Rol inválido"})
		return
	}

	if rol != "administrador" {
		fmt.Println("❌ Rol no es administrador:", rol)
		c.JSON(403, gin.H{"error": "No tienes permisos para realizar esta acción"})
		return
	}

	id := c.Param("id")
	var input dto.CreateActividadDTO

	if err := c.ShouldBindJSON(&input); err != nil {
		fmt.Println("❌ Error al parsear JSON:", err)
		c.JSON(400, gin.H{"error": "entrada inválida: " + err.Error()})
		return
	}

	fmt.Println("📥 Datos recibidos para actualizar:", input)

	err := services.ActualizarActividad(id, input)
	if err != nil {
		fmt.Println("❌ Error al actualizar actividad:", err)
		c.JSON(500, gin.H{"error": "no se pudo actualizar la actividad: " + err.Error()})
		return
	}

	fmt.Println("✅ Actividad actualizada correctamente")
	c.JSON(200, gin.H{"mensaje": "actividad actualizada correctamente"})
}

func DeleteActividad(c *gin.Context) {
	// Verificar autenticación y rol
	if _, existe := c.Get("usuarioID"); !existe {
		fmt.Println("❌ Usuario no autenticado")
		c.JSON(401, gin.H{"error": "Usuario no autenticado"})
		return
	}

	// Verificar rol de administrador
	rolRaw, existe := c.Get("rol")
	if !existe {
		fmt.Println("❌ Rol no encontrado en el token")
		c.JSON(403, gin.H{"error": "Rol no encontrado en el token"})
		return
	}

	rol, ok := rolRaw.(string)
	if !ok {
		fmt.Println("❌ Rol no es un string:", rolRaw)
		c.JSON(403, gin.H{"error": "Rol inválido"})
		return
	}

	if rol != "administrador" {
		fmt.Println("❌ Rol no es administrador:", rol)
		c.JSON(403, gin.H{"error": "No tienes permisos para realizar esta acción"})
		return
	}

	id := c.Param("id")

	err := services.EliminarActividadPorID(id)
	if err != nil {
		fmt.Println("❌ Error al eliminar actividad:", err)
		c.JSON(500, gin.H{"error": "No se pudo eliminar la actividad"})
		return
	}

	fmt.Println("✅ Actividad eliminada correctamente")
	c.JSON(200, gin.H{"mensaje": "actividad eliminada correctamente"})
}

func FiltrarActividades(c *gin.Context) {
	clave := c.Query("clave")
	dia := c.Query("dia")
	horario := c.Query("horario")

	actividades, err := services.FiltrarActividades(clave, dia, horario)
	if err != nil {
		c.JSON(500, gin.H{"error": "No se pudieron obtener las actividades"})
		return
	}

	c.JSON(200, actividades)
}

func UploadActividadImagen(c *gin.Context) {
	// Verificar autenticación y rol
	if _, existe := c.Get("usuarioID"); !existe {
		fmt.Println("❌ Usuario no autenticado")
		c.JSON(401, gin.H{"error": "Usuario no autenticado"})
		return
	}

	// Verificar rol de administrador
	rolRaw, existe := c.Get("rol")
	if !existe {
		fmt.Println("❌ Rol no encontrado en el token")
		c.JSON(403, gin.H{"error": "Rol no encontrado en el token"})
		return
	}

	rol, ok := rolRaw.(string)
	if !ok || rol != "administrador" {
		fmt.Println("❌ Rol no es administrador:", rol)
		c.JSON(403, gin.H{"error": "No tienes permisos para realizar esta acción"})
		return
	}

	// Obtener el archivo
	file, err := c.FormFile("imagen")
	if err != nil {
		c.JSON(400, gin.H{"error": "No se pudo obtener el archivo"})
		return
	}

	// Crear directorio si no existe
	uploadDir := "./uploads"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		c.JSON(500, gin.H{"error": "No se pudo crear el directorio de uploads"})
		return
	}

	// Generar nombre único para el archivo
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), filepath.Ext(file.Filename))
	filepath := filepath.Join(uploadDir, filename)

	// Guardar el archivo
	if err := c.SaveUploadedFile(file, filepath); err != nil {
		c.JSON(500, gin.H{"error": "No se pudo guardar el archivo"})
		return
	}

	// Devolver la URL relativa del archivo
	c.JSON(200, gin.H{
		"url": fmt.Sprintf("/uploads/%s", filename),
	})
}

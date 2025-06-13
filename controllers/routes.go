package controllers

import (
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/utils"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	r.POST("/login", Login)
	r.POST("/register", Register)

	// Rutas públicas de actividades
	r.GET("/actividades", GetActividades)
	r.GET("/actividades/filtrar", FiltrarActividades)
	r.GET("/actividades/:id", GetActividadPorID)

	// Servir archivos estáticos
	r.Static("/uploads", "./uploads")

	// Rutas protegidas con JWT
	auth := r.Group("/")
	auth.Use(utils.AuthMiddleware())
	{
		// Rutas de usuarios
		auth.POST("/usuarios", PostUsuario)
		auth.GET("/usuarios", GetUsuariosPorRol)
		auth.DELETE("/usuarios/:id", DeleteUsuario)
		auth.PUT("/usuarios/:id", UpdateUsuario)

		// Rutas de actividades protegidas
		auth.POST("/actividades", PostActividad)
		auth.PUT("/actividades/:id", PutActividad)
		auth.DELETE("/actividades/:id", DeleteActividad)
		auth.POST("/actividades/upload", UploadActividadImagen)

		// Rutas de inscripciones
		auth.POST("/inscripciones", PostInscripcion)
		auth.GET("/mis-actividades", GetMisActividades)
		auth.GET("/actividades/:id/inscripciones", GetInscriptosPorActividad)
		auth.GET("/inscripciones/:id/check", CheckInscripcion)
		auth.DELETE("/inscripciones/:id", DeleteInscripcion)
	}
}

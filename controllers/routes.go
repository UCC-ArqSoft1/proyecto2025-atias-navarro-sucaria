package controllers

import (
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/utils"
	"github.com/gin-gonic/gin"
)

// func RegisterRoutes(r *gin.Engine) {
// 	r.POST("/login", Login)
// 	r.POST("/register", Register)

// 	r.POST("/usuarios", PostUsuario)
// 	r.GET("/usuarios/", GetUsuariosPorRol)
// 	r.DELETE("/usuarios/:id", DeleteUsuario)
// 	r.PUT("/usuarios/:id", UpdateUsuario)

// 	r.POST("/actividades", PostActividad)
// 	r.GET("/actividades", GetActividades)
// 	r.GET("/actividades/:id", GetActividadPorID)
// 	r.PUT("/actividades/:id", PutActividad)
// 	r.DELETE("/actividades/:id", DeleteActividad)

// 	r.POST("/inscripciones", PostInscripcion)
// 	r.GET("/mis-actividades", GetMisActividades)
// 	r.GET("/actividades/:id/inscripciones", GetInscriptosPorActividad)
// 	r.GET("/inscripciones/:id/check", CheckInscripcion)
// 	r.DELETE("/inscripciones/:id", DeleteInscripcion)

// }

func RegisterRoutes(r *gin.Engine) {
	r.POST("/login", Login)
	r.POST("/register", Register)

	r.GET("/actividades", GetActividades)
	r.GET("/actividades/filtrar", FiltrarActividades)
	r.GET("/actividades/:id", GetActividadPorID)

	r.POST("/actividades", PostActividad)
	r.PUT("/actividades/:id", PutActividad)

	// Rutas protegidas con JWT
	auth := r.Group("/")
	auth.Use(utils.AuthMiddleware())
	{
		auth.POST("/usuarios", PostUsuario)
		auth.GET("/usuarios", GetUsuariosPorRol)
		auth.DELETE("/usuarios/:id", DeleteUsuario)
		auth.PUT("/usuarios/:id", UpdateUsuario)

		auth.DELETE("/actividades/:id", DeleteActividad)

		auth.POST("/inscripciones", PostInscripcion)
		auth.GET("/mis-actividades", GetMisActividades)
		auth.GET("/actividades/:id/inscripciones", GetInscriptosPorActividad)
		auth.GET("/inscripciones/:id/check", CheckInscripcion)
		auth.DELETE("/inscripciones/:id", DeleteInscripcion)
	}
}

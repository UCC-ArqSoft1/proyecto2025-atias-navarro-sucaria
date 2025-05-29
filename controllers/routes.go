package controllers

import "github.com/gin-gonic/gin"

func RegisterRoutes(r *gin.Engine) {
	r.POST("/login", Login)
	r.POST("/register", Register)

	r.POST("/usuarios", PostUsuario)
	r.GET("/usuarios/", GetUsuariosPorRol)
	r.DELETE("/usuarios/:id", DeleteUsuario)
	r.PUT("/usuarios/:id", UpdateUsuario)

	r.POST("/actividades", PostActividad)
	r.GET("/actividades", GetActividades)
	r.GET("/actividades/:id", GetActividadPorID)
	r.PUT("/actividades/:id", PutActividad)
	r.DELETE("/actividades/:id", DeleteActividad)

	r.POST("/inscripciones", PostInscripcion)
	r.GET("/mis-actividades", GetMisActividades)
	r.GET("/actividades/:id/inscripciones", GetInscriptosPorActividad)
	r.DELETE("/inscripciones/:id", DeleteInscripcion)

}

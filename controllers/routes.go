package controllers

import "github.com/gin-gonic/gin"

func RegisterRoutes(r *gin.Engine) {
	r.POST("/usuarios", PostUsuario)
	r.GET("/usuarios/", GetUsuariosPorRol)
	r.POST("/login", Login)
	r.DELETE("/usuarios/:id", DeleteUsuario)
	r.PUT("/usuarios/:id", UpdateUsuario)

	r.POST("/actividades", PostActividad)
}

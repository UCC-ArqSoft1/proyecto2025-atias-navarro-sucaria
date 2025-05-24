package controllers

import "github.com/gin-gonic/gin"

func RegisterRoutes(r *gin.Engine) {
	r.POST("/usuarios", PostUsuario)
	r.GET("/usuarios/", GetUsuariosPorRol)
}

package controllers

import "github.com/gin-gonic/gin"

func RegisterRoutes(r *gin.Engine) {
	r.GET("/usuarios", GetUsuarios)
	r.POST("/usuarios", PostUsuario)
}

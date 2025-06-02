package main

import (
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/controllers"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/db"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	db.InitDB()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	controllers.RegisterRoutes(r)

	r.Run(":8080")
}

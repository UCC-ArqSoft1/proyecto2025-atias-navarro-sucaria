package main

import (
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/controllers"
	"github.com/UCC-ArqSoft1/proyecto2025-atias-navarro-sucaria/db"
	"github.com/gin-gonic/gin"
)

func main() {
	db.InitDB()

	r := gin.Default()

	controllers.RegisterRoutes(r)

	r.Run(":8080")
}

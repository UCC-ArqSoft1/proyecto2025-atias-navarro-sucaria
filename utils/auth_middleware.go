package utils

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			fmt.Println("❌ Token no proporcionado")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token no proporcionado"})
			c.Abort()
			return
		}

		// Formato esperado: "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			fmt.Println("❌ Formato de token inválido:", authHeader)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Formato de token inválido"})
			c.Abort()
			return
		}

		tokenString := parts[1]
		fmt.Println("🔑 Token recibido:", tokenString)

		// Parsear y validar el token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("método de firma inesperado: %v", token.Header["alg"])
			}
			return JWT_SECRET, nil
		})

		if err != nil {
			fmt.Println("❌ Error al parsear token:", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token inválido o expirado"})
			c.Abort()
			return
		}

		if !token.Valid {
			fmt.Println("❌ Token inválido (token.Valid == false)")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token inválido o expirado"})
			c.Abort()
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			fmt.Println("📦 Claims decodificados:", claims)

			uidFloat, ok := claims["user_id"].(float64)
			if !ok {
				fmt.Println("❌ Claim 'user_id' no válido:", claims["user_id"])
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Token sin user_id válido"})
				c.Abort()
				return
			}

			usuarioID := uint(uidFloat)
			fmt.Println("🛡️ Usuario autenticado con ID:", usuarioID)
			c.Set("usuarioID", usuarioID)
		} else {
			fmt.Println("❌ No se pudieron leer los claims")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No se pudieron leer los claims"})
			c.Abort()
			return
		}

		c.Next()
	}
}

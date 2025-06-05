package utils

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const jwtDuration = 24 * time.Hour

func GenerateJWT(userID int) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(jwtDuration).Unix(),
		"iat":     time.Now().Unix(),
		"nbf":     time.Now().Unix(),
		"iss":     "backend",
		"sub":     "auth",
		"jti":     time.Now().Format("20060102150405"),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(JWT_SECRET)
}

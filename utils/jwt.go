package utils

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const (
	jwtDuration = 24 * time.Hour
	jwtSecret   = "JwtSecret"
)

func GenerateJWT(userID int) (string, error) {
	expirationTime := time.Now().Add(jwtDuration)

	claims := &jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(expirationTime),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		NotBefore: jwt.NewNumericDate(time.Now()),
		Issuer:    "backend",
		Subject:   "auth",
		ID:        fmt.Sprintf("%d", userID),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		return "", fmt.Errorf("error generating token: %w", err)
	}
	return tokenString, nil
}

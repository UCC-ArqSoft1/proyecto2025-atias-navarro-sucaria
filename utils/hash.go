package utils

import (
	"crypto/sha256"
	"encoding/hex"
)

func HashSHA256(value string) string {
	hash := sha256.Sum256([]byte(value))
	return hex.EncodeToString(hash[:])
}

package utils

import "os"

var JWT_SECRET = []byte(os.Getenv("JWT_SECRET"))

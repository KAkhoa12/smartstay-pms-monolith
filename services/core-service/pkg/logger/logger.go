package logger

import (
	"log"
	"os"
)

func New() *log.Logger {
	return log.New(os.Stdout, "[auth-service] ", log.LstdFlags|log.Lshortfile)
}

package main

import (
	"os"

	"github.com/onlyati/book-tracker/pkg/app"
)

func main() {
	application := app.App{}
	exitCode := application.Run()
	os.Exit(exitCode)
}

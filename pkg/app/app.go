package app

import (
	"log/slog"

	"github.com/onlyati/book-tracker/pkg/configs"
	"github.com/onlyati/book-tracker/pkg/db"
	"gorm.io/gorm"
)

type App struct {
	Config configs.AppConfig
	Db     *gorm.DB
}

func (app *App) Run() int {
	args, ctx, err := parseArgs()
	if err != nil {
		slog.Error("invalid arguments", "description", err)
		return 1
	}
	config, err := configs.ParseConfigFromYAML(args.Config)
	if err != nil {
		slog.Error("failed to parse config", "description", err)
		return 1
	}
	app.Config = *config

	dbConn, err := db.CreateDbConnection(app.Config)
	if err != nil {
		slog.Error("failed to connect to database", "description", err)
		return 1
	}
	app.Db = dbConn

	// Do the thing why it is started
	switch ctx.Command() {
	case "migrate":
		err := db.DatabaseAutoMigration(app.Config)
		if err != nil {
			return 4
		}
	case "listen":
		err := app.StartListen()
		if err != nil {
			return 4
		}
	}

	return 0
}

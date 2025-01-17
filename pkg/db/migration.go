package db

import (
	"log/slog"

	"github.com/onlyati/book-tracker/pkg/configs"
)

func DatabaseAutoMigration(config configs.AppConfig) error {
	db, err := CreateDbConnection(config)
	if err != nil {
		slog.Error("failed to connect to database", "error", err)
		return err
	}

	// Run migrations
	err = db.AutoMigrate(
		&Author{},
		&Book{},
		&Category{},
		&User{},
	)
	if err != nil {
		slog.Error("failed to migrate database", "error", err)
		return err
	}
	slog.Info("database migration is done")
	return nil
}

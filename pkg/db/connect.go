package db

import (
	"fmt"
	"log/slog"

	"github.com/onlyati/book-tracker/pkg/configs"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func CreateDbConnection(config configs.AppConfig) (*gorm.DB, error) {
	slog.Info(
		"connect to database",
		"hostname", config.Db.HostName,
		"port", config.Db.Port,
		"db_name", config.Db.DbName,
		"user", config.Db.User,
	)

	connectionString := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%d sslmode=disable",
		config.Db.HostName,
		config.Db.User,
		config.Db.Password,
		config.Db.DbName,
		config.Db.Port,
	)
	db, err := gorm.Open(postgres.Open(connectionString), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return db, nil
}

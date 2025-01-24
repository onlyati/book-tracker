package db

import (
	"fmt"
	"log"
	"log/slog"
	"os"

	"github.com/onlyati/book-tracker/pkg/configs"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
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

	newLogger := logger.New(
		log.New(os.Stdout, "", log.LstdFlags),
		logger.Config{
			LogLevel: logger.Info, // Log level Info will output everything
		},
	)

	db, err := gorm.Open(postgres.Open(connectionString), &gorm.Config{
		Logger: newLogger,
	})
	if err != nil {
		return nil, err
	}

	return db, nil
}

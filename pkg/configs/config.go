package configs

import (
	"errors"
	"log/slog"
	"os"
	"reflect"

	"gopkg.in/yaml.v3"
)

type AppConfig struct {
	Db   DbConfig   `yaml:"db"`
	Api  ApiConfig  `yaml:"api"`
	Cors CorsConfig `yaml:"cors"`
}

type DbConfig struct {
	HostName     string `yaml:"hostname"`
	Port         int    `yaml:"port"`
	DbName       string `yaml:"db_name"`
	User         string `yaml:"user"`
	Password     string `yaml:"-" validate:"-"`
	PasswordPath string `yaml:"password_path"`
}

type ApiConfig struct {
	HostName      string `yaml:"hostname"`
	Port          int    `yaml:"port"`
	OpenApiServer string `yaml:"openapi_server"`
	OpenApiPort   string `yaml:"openapi_port"`
}

type CorsConfig struct {
	Origins string `yaml:"origins"`
	Methods string `yaml:"methods"`
}

func ParseConfigFromYAML(path string) (*AppConfig, error) {
	file, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var appConfig AppConfig
	err = yaml.Unmarshal(file, &appConfig)
	if err != nil {
		return nil, err
	}

	pw, err := os.ReadFile(appConfig.Db.PasswordPath)
	if err != nil {
		slog.Error("failed to read password file", "file_path", appConfig.Db.PasswordPath)
		return nil, err
	}
	appConfig.Db.Password = string(pw)

	// Validate the data
	isError := false

	if validate(appConfig.Db) != nil {
		slog.Error("failed to parse database config")
		isError = true
	}

	if validate(appConfig.Api) != nil {
		slog.Error("failed to parse api config")
		isError = true
	}

	if validate(appConfig.Cors) != nil {
		slog.Error("failed to parse cors config")
		isError = true
	}

	slog.Info("config has been read", "config", appConfig)

	if isError {
		return nil, errors.New("invalid config")
	}

	return &appConfig, nil
}

func validate(x interface{}) error {
	isError := false

	val := reflect.ValueOf(x)
	if val.Kind() == reflect.Pointer {
		val = val.Elem()
	}

	if val.Kind() != reflect.Struct {
		slog.Error("internal error", "reason", "expected struct but got: "+val.Kind().String())
		return errors.New("internal error")
	}

	for i := 0; i < val.NumField(); i++ {
		field := val.Field(i)
		fieldValue := field.Interface()
		yamlTag := val.Type().Field(i).Tag.Get("yaml")
		ignoreTag := val.Type().Field(i).Tag.Get("validate")
		zero := reflect.Zero(val.Type())

		if ignoreTag != "-" && reflect.DeepEqual(fieldValue, zero) {
			isError = true
			slog.Error("invalid database config", "reason", "missing db>"+yamlTag+"field")
		}
	}

	if isError {
		return errors.New("failed to parse database config")
	}

	return nil
}

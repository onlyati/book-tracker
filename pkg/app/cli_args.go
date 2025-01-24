package app

import (
	"errors"
	"log/slog"
	"os"

	"github.com/alecthomas/kong"
)

type Cli struct {
	JsonLog bool     `help:"Log output format is JSON."`
	Config  string   `help:"Path for the config YAML file."`
	Migrate struct{} `cmd:"" help:"Perform database migration"`
	Listen  struct{} `cmd:"" help:"Start REST API"`
}

func (cli Cli) Validate() error {
	if cli.Config == "" {
		return errors.New("missing --config parameter")
	}

	return nil
}

func parseArgs() (*Cli, *kong.Context, error) {
	var args Cli
	ctx := kong.Parse(&args)
	if args.JsonLog {
		logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
			Level: slog.LevelDebug,
		}))
		slog.SetDefault(logger)
	} else {
		logger := slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
			Level: slog.LevelDebug,
		}))
		slog.SetDefault(logger)
	}
	err := args.Validate()
	if err != nil {
		return nil, nil, err
	}

	return &args, ctx, nil
}

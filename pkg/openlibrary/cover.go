package openlibrary

import (
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
)

func GetCover(size string, isbn int, path string) error {
	addr := fmt.Sprintf("https://covers.openlibrary.org/b/isbn/%d-%s.jpg", isbn, size)
	slog.Debug("get cover based on isbn", "isbn", isbn, "url", addr)

	resp, err := http.Get(addr)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	slog.Debug("return code from url", "return_code", resp.StatusCode)

	if resp.StatusCode != http.StatusOK {
		slog.Error("invalid return code", "return_code", resp.StatusCode, "expected_code", http.StatusOK)
		return fmt.Errorf("failed to fetch cover, error: %v", err)
	}

	fileName := fmt.Sprintf("%s/%d-%s.jpg", path, isbn, size)
	outfile, err := os.Create(fileName)
	if err != nil {
		return err
	}
	defer outfile.Close()

	_, err = io.Copy(outfile, resp.Body)
	return err
}

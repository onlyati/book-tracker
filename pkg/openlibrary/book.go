package openlibrary

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
)

func GetBook(isbn int) (*Book, error) {
	// We are looking for book based on its ISBN number
	addr := fmt.Sprintf("https://openlibrary.org/isbn/%d.json", isbn)
	slog.Debug("fetching based on ISBN", "isbn", isbn, "url", addr)

	resp, err := http.Get(addr)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	slog.Debug("return code from url", "return_code", resp.StatusCode)

	// Normally this link return with 302 which redirect for the book JSON data
	if resp.StatusCode != http.StatusOK {
		slog.Error("invalid return code", "return_code", resp.StatusCode, "expected_code", http.StatusOK)
		return nil, fmt.Errorf("failed to fetch by ISBN: %v", resp.StatusCode)
	}

	// Try to decode the received JSON string
	var book Book
	decoder := json.NewDecoder(resp.Body)
	err = decoder.Decode(&book)
	if err != nil {
		return nil, err
	}

	return &book, nil
}

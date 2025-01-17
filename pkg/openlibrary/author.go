package openlibrary

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"strings"
)

func GetAuthor(key string) (*Author, error) {
	// If the .json is omitted it would open the HTML website not the JSON data
	if !strings.HasSuffix(key, ".json") {
		key = key + ".json"
	}

	// Just fetch it via using the API
	addr := fmt.Sprintf("https://openlibrary.org%s", key)
	slog.Debug("fetching author", "key", key, "url", addr)
	resp, err := http.Get(addr)
	if err != nil {
		return nil, err
	}
	slog.Debug("return code from url", "return_code", resp.StatusCode)

	// This should return with a normal response
	if resp.StatusCode != http.StatusOK {
		slog.Error("invalid return code", "return_code", resp.StatusCode, "expected_code", http.StatusOK, "url", addr)
		return nil, fmt.Errorf("failed to fetch by author key: %s %v", key, resp.StatusCode)
	}

	var author Author
	decoder := json.NewDecoder(resp.Body)
	err = decoder.Decode(&author)
	if err != nil {
		return nil, err
	}
	author.Key = key

	return &author, nil
}

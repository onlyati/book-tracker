package app

import (
	"log/slog"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/onlyati/book-tracker/pkg/db"
)

//
// Create
//

func (app *App) CreateBookV1(c *gin.Context) {
	isbnStr := c.Query("isbn")
	if isbnStr == "" {
		c.JSON(http.StatusBadRequest, Error{Error: "missing isbn query parameter"})
		return
	}

	isbn, err := strconv.ParseUint(isbnStr, 10, 64)
	if err != nil {
		slog.Error("error occurred during number conversion", "error", err)
		c.JSON(http.StatusBadRequest, Error{Error: "isbn query parameter is not a number: " + isbnStr})
		return
	}

	book, err := db.CreateBookService(app.Db, isbn)
	if err != nil {
		slog.Error("error occurred during creating book", "error", err)
		c.JSON(http.StatusInternalServerError, Error{Error: "internal server error"})
		return
	}

	c.JSON(http.StatusOK, book)
}

//
// Read
//

func (app *App) GetBookV1(c *gin.Context) {
	idStr := c.Query("id")
	if idStr == "" {
		c.JSON(http.StatusBadRequest, Error{Error: "missing id query parameter"})
		return
	}

	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		slog.Error("error occurred during number conversion", "error", err)
		c.JSON(http.StatusBadRequest, Error{Error: "id query parameter is not a number: " + idStr})
		return
	}

	book, err := db.ReadBookService(app.Db, id)
	if err != nil {
		slog.Error("error occurred during get book", "error", err)
		c.JSON(http.StatusInternalServerError, Error{Error: "internal server error"})
		return
	}

	if book.Title == "" {
		c.JSON(http.StatusNotFound, Error{Error: "specified book does not exists"})
		return
	}

	c.JSON(http.StatusOK, book)
}

func (app *App) GetBooksV1(c *gin.Context) {
	idStr := c.Query("index")
	if idStr == "" {
		idStr = "0"
	}

	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		slog.Error("error occurred during number conversion", "error", err)
		c.JSON(http.StatusBadRequest, Error{Error: "id query parameter is not a number: " + idStr})
		return
	}

	book, err := db.ListBookService(app.Db, id)
	if err != nil {
		slog.Error("error occurred during get book", "error", err)
		c.JSON(http.StatusInternalServerError, Error{Error: "internal server error"})
		return
	}

	c.JSON(http.StatusOK, book)
}

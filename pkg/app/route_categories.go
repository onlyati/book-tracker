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

func (app *App) CreateCategoryV1(c *gin.Context) {
	name := c.Query("name")
	if name == "" {
		c.JSON(http.StatusBadRequest, Error{Error: "missing id parameter"})
		return
	}

	category, err := db.CreateCategoryService(app.Db, name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Error{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, category)
}

//
// Read
//

func (app *App) GetCategoryV1(c *gin.Context) {
	name := c.Query("name")
	if name == "" {
		c.JSON(http.StatusBadRequest, Error{Error: "missing id parameter"})
		return
	}

	category, err := db.ReadCategoryService(app.Db, name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Error{Error: err.Error()})
		return
	}

	if category.Name == "" {
		c.JSON(http.StatusNotFound, Error{Error: "category not found"})
		return
	}

	c.JSON(http.StatusOK, category)
}

func (app *App) GetCategoriesV1(c *gin.Context) {
	id := c.Query("id")
	if id == "" {
		id = "0"
	}

	index, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		slog.Error("failed to parse number", "error", err)
		c.JSON(http.StatusBadRequest, Error{Error: "parameter is not a number"})
		return
	}

	categories, err := db.ListCategoriesService(app.Db, index)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Error{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, categories)
}

//
// Update
//

func (app *App) UpdateCategoryV1(c *gin.Context) {
	id := c.Query("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, Error{Error: "missing new_name parameter"})
		return
	}

	newName := c.Query("new_name")
	if newName == "" {
		c.JSON(http.StatusBadRequest, Error{Error: "missing new_name parameter"})
		return
	}

	index, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		slog.Error("failed to parse number", "error", err)
		c.JSON(http.StatusBadRequest, Error{Error: "id parameter is not an unsigned number"})
		return
	}

	category, err := db.UpdateCategoryService(app.Db, index, newName)
	if err != nil {
		if err.Error() == "record not found" {
			c.JSON(http.StatusNotFound, Error{Error: "category id not found"})
		} else {
			c.JSON(http.StatusInternalServerError, Error{Error: err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, category)
}

//
// Delete
//

func (app *App) DeleteCategoryV1(c *gin.Context) {
	id := c.Query("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, Error{Error: "missing new_name parameter"})
		return
	}

	index, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		slog.Error("failed to parse number", "error", err)
		c.JSON(http.StatusBadRequest, Error{Error: "parameter is not a number"})
		return
	}

	err = db.DeleteCategoryService(app.Db, index)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Error{Error: err.Error()})
		return
	}

	c.Status(http.StatusOK)
}

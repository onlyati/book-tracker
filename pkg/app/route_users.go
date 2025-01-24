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

func (app *App) CreateUserV1(c *gin.Context) {
	name := c.Query("name")
	if name == "" {
		c.JSON(http.StatusBadRequest, Error{Error: "missing id parameter"})
		return
	}

	user, err := db.CreateUserService(app.Db, name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Error{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, user)
}

//
// Read
//

func (app *App) GetUserV1(c *gin.Context) {
	name := c.Query("name")
	if name == "" {
		c.JSON(http.StatusBadRequest, Error{Error: "missing id parameter"})
		return
	}

	user, err := db.ReadUserService(app.Db, name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Error{Error: err.Error()})
		return
	}

	if user.Name == "" {
		c.JSON(http.StatusNotFound, Error{Error: "user not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (app *App) GetUsersV1(c *gin.Context) {
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

	users, err := db.ListUsersService(app.Db, index)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Error{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, users)
}

//
// Update
//

func (app *App) UpdateUserV1(c *gin.Context) {
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

	user, err := db.UpdateUserService(app.Db, index, newName)
	if err != nil {
		if err.Error() == "record not found" {
			c.JSON(http.StatusNotFound, Error{Error: "user id not found"})
		} else {
			c.JSON(http.StatusInternalServerError, Error{Error: err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, user)
}

//
// Delete
//

func (app *App) DeleteUserV1(c *gin.Context) {
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

	err = db.DeleteUserService(app.Db, index)
	if err != nil {
		c.JSON(http.StatusInternalServerError, Error{Error: err.Error()})
		return
	}

	c.Status(http.StatusOK)
}

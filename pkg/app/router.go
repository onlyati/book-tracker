package app

import (
	"html/template"

	"github.com/gin-gonic/gin"
	embedded "github.com/onlyati/book-tracker"
)

type Error struct {
	Error string `json:"error"`
}

func (app *App) StartListen() error {
	router := gin.Default()

	templates := template.Must(template.ParseFS(embedded.StaticFiles, "static/*.html"))
	router.SetHTMLTemplate(templates)

	// Host the website on root
	// TODO when its done

	// The API itself is hosted on /api
	api := router.Group("/api")

	// OpenApi doc endpoints
	docs := api.Group("/docs")
	docs.GET("/", app.GetSwaggerUI)
	docs.GET("/index.html", app.GetSwaggerUI)
	docs.GET("/oauth2-redirect.html", app.GetRedirect)
	docs.GET("/openapi.yaml", app.GetSwaggerYAML)

	// User endpoints
	user := api.Group("/user")
	userVersion1 := user.Group("/v1")
	userVersion1.POST("/", app.CreateUserV1)
	userVersion1.GET("/", app.GetUserV1)
	userVersion1.GET("/list", app.GetUsersV1)
	userVersion1.PATCH("/", app.UpdateUserV1)
	userVersion1.DELETE("/", app.SoftDeleteUserV1)
	userVersion1.DELETE("/cleanup", app.HardDeleteUsersV1)

	// Category endpoints
	category := api.Group("/category")
	categoryVersion1 := category.Group("/v1")
	categoryVersion1.POST("/", app.CreateCategoryV1)
	categoryVersion1.GET("/", app.GetCategoryV1)
	categoryVersion1.GET("/list", app.GetCategoriesV1)
	categoryVersion1.PATCH("/", app.UpdateCategoryV1)
	categoryVersion1.DELETE("/", app.SoftDeleteCategoryV1)
	categoryVersion1.DELETE("/cleanup", app.HardDeleteCategoriesV1)

	router.Run(":3000")

	return nil
}

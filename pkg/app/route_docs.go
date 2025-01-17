package app

import (
	"net/http"
	"strings"
	"text/template"

	"github.com/gin-gonic/gin"
	embedded "github.com/onlyati/book-tracker"
)

func (app *App) GetSwaggerYAML(c *gin.Context) {
	fileContent, err := embedded.StaticFiles.ReadFile("static/openapi.yaml")
	if err != nil {
		c.JSON(http.StatusInternalServerError, Error{Error: "Failed to load embedded file: " + err.Error()})
		return
	}

	template, err := template.New("openapi").Parse(string(fileContent))
	if err != nil {
		c.JSON(http.StatusInternalServerError, Error{Error: err.Error()})
		return
	}

	builder := &strings.Builder{}

	err = template.Execute(builder, gin.H{
		"HostName": app.Config.Api.OpenApiServer,
		"Port":     app.Config.Api.OpenApiPort,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, Error{Error: err.Error()})
		return
	}
	result := builder.String()

	c.Data(http.StatusOK, "application/yaml", []byte(result))
}

func (app *App) GetSwaggerUI(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", gin.H{
		"HostName": app.Config.Api.OpenApiServer,
		"Port":     app.Config.Api.OpenApiPort,
	})
}

func (app *App) GetRedirect(c *gin.Context) {
	c.HTML(http.StatusOK, "oauth2-redirect.html", gin.H{})
}

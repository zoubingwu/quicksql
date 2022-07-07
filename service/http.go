package service

import (
	"database/sql"
	"embed"
	"io/fs"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

const port = ":9888"

//go:embed dist
var content embed.FS

func getFileSystem() http.FileSystem {
	assetFs, err := fs.Sub(content, "dist")
	if err != nil {
		panic(err)
	}

	return http.FS(assetFs)
}

func NewEchoServer() {
	e := echo.New()
	e.HideBanner = true
	e.Use(middleware.Logger())

	assets := http.FileServer(getFileSystem())
	e.GET("/", echo.WrapHandler(assets))
	e.GET("/assets/*", echo.WrapHandler(assets))
	apis := e.Group("/api")
	apis.GET("/database", getDatabase)
	e.Logger.Fatal(e.Start(port))
}

func getDatabase(c echo.Context) error {
	db, err := sql.Open("mysql", "root@tcp(localhost:3306)/toptal_test")
	if err != nil {
		return err
	}
	defer db.Close()

	conn := &Conn{db: db}

	rows, err := conn.ShowTables()
	if err != nil {
		return err
	}

	c.JSON(http.StatusOK, Object{
		"data": rows,
	})
	return nil
}

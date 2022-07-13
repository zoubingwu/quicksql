package service

import (
	"database/sql"
	"embed"
	"fmt"
	"golang.org/x/term"
	"io/fs"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"syscall"
	"time"

	"github.com/go-playground/validator"
	_ "github.com/go-sql-driver/mysql"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

//go:embed dist
var content embed.FS

func getFileSystem() http.FileSystem {
	assetFs, err := fs.Sub(content, "dist")
	if err != nil {
		panic(err)
	}

	return http.FS(assetFs)
}

type Object map[string]any

type CustomValidator struct {
	validator *validator.Validate
}

func (cv *CustomValidator) Validate(i interface{}) error {
	if err := cv.validator.Struct(i); err != nil {
		return err
	}
	return nil
}

func getCredentials() (string, error) {
	fmt.Print("Enter Password: ")
	bytePassword, err := term.ReadPassword(syscall.Stdin)
	fmt.Println()
	if err != nil {
		return "", err
	}

	password := string(bytePassword)
	return strings.TrimSpace(password), nil
}

func NewServer(host string, port int, user string) {
	password, _ := getCredentials()
	var dsn string
	if len(password) > 0 {
		dsn = fmt.Sprintf("%s:%s@tcp(%s:%d)/", user, password, host, port)
	} else {
		dsn = fmt.Sprintf("%s@tcp(%s:%d)/", user, host, port)
	}

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("Error: ", err.Error())
	}
	defer func(db *sql.DB) {
		err := db.Close()
		if err != nil {
			log.Fatal("Error: ", err.Error())
		}
	}(db)

	h := NewHandlers(db)

	e := echo.New()
	e.HideBanner = true
	e.Logger.SetOutput(ioutil.Discard)

	e.Use(middleware.Logger())
	e.Use(middleware.TimeoutWithConfig(middleware.TimeoutConfig{
		Timeout: 15 * time.Second,
	}))
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.PUT, echo.POST, echo.DELETE},
	}))
	e.Validator = &CustomValidator{validator: validator.New()}

	assets := http.FileServer(getFileSystem())
	e.GET("/", echo.WrapHandler(assets))
	e.GET("/assets/*", echo.WrapHandler(assets))

	apis := e.Group("/api")
	apis.POST("/ping", h.Ping)
	apis.GET("/databases", h.ShowDatabases)

	fmt.Println("You can now open SQL editor in your browser at http://localhost:9888")
	e.Logger.Fatal(e.Start(":9888"))
}

type Response struct {
	Message string `json:"message"`
	Code    int    `json:"code"`
}

func NewResponse(message string, code int) *Response {
	return &Response{Message: message, Code: code}
}

func ResponseOk() *Response {
	return NewResponse("ok", 0)
}

func ResponseError(err error) *Response {
	return NewResponse(err.Error(), 10000)
}

type Handler struct {
	db *Connection
}

func NewHandlers(db *sql.DB) *Handler {
	return &Handler{db: &Connection{db: db}}
}

func (h *Handler) Ping(c echo.Context) error {
	err := h.db.Ping()
	if err != nil {
		return c.JSON(http.StatusBadRequest, ResponseError(err))
	}
	return c.JSON(http.StatusOK, ResponseOk())
}

func (h *Handler) ShowDatabases(c echo.Context) error {
	dbs, err := h.db.ShowDatabases()
	if err != nil {
		return c.JSON(http.StatusBadRequest, ResponseError(err))
	}
	return c.JSON(http.StatusOK, Object{
		"data": dbs,
	})
}

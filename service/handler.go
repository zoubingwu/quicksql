package service

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/samber/lo"
)

type Handler struct {
	conn *Connection
}

func NewHandlers(db *sql.DB) *Handler {
	return &Handler{conn: &Connection{db: db}}
}

func (h *Handler) Ping(c echo.Context) error {
	err := h.conn.Ping()
	if err != nil {
		return c.JSON(http.StatusBadRequest, ResponseError(err))
	}
	return c.JSON(http.StatusOK, ResponseOk())
}

func (h *Handler) ShowDatabases(c echo.Context) error {
	rows, err := h.conn.Query("SHOW DATABASES")
	if err != nil {
		return c.JSON(http.StatusBadRequest, ResponseError(err))
	}

	dbs := lo.Map[Object, string](rows, func(t Object, i int) string {
		if t, ok := rows[i]["Database"].(string); ok {
			return t
		}
		return ""
	})

	return c.JSON(http.StatusOK, NewResponseWithData(dbs))
}

type DbTarget struct {
	Db string `query:"db"`
}

func (h *Handler) ShowTables(c echo.Context) error {
	row, err := h.conn.QueryOne(fmt.Sprintf("SHOW TABLES FROM `%s`", c.Param("db")))
	if err != nil {
		return c.JSON(http.StatusBadRequest, ResponseError(err))
	}
	data := lo.Values(row)
	return c.JSON(http.StatusOK, NewResponseWithData(data))
}

type TableTarget struct {
	DbTarget

	Table string `query:"table"`
}

func (h *Handler) DescribeTable(c echo.Context) error {
	cond := new(TableTarget)
	if err := c.Bind(cond); err != nil {
		return c.JSON(http.StatusBadRequest, ResponseError(err))
	}

	rows, err := h.conn.Query(fmt.Sprintf("DESCRIBE `%s`.`%s`", cond.Db, cond.Table))
	if err != nil {
		return c.JSON(http.StatusBadRequest, ResponseError(err))
	}

	tds := lo.Map[Object, *TableDescription](rows, func(row Object, i int) *TableDescription {
		r, _ := NewTableDescription(row)
		return r
	})

	if err != nil {
		return c.JSON(http.StatusBadRequest, ResponseError(err))
	}

	return c.JSON(http.StatusOK, NewResponseWithData(tds))
}

type SelectCondition struct {
	TableTarget

	OrderBy string `query:"orderBy"`
	Sort    string `query:"sort"`
	Limit   string `query:"limit"`
}

func (h *Handler) SelectFromTable(c echo.Context) error {
	cond := new(SelectCondition)
	if err := c.Bind(cond); err != nil {
		return c.JSON(http.StatusBadRequest, ResponseError(err))
	}
	s := fmt.Sprintf("SELECT * FROM `%s`.`%s` ORDER BY `%s` %s LIMIT %s", cond.Db, cond.Table, cond.OrderBy, cond.Sort, cond.Limit)

	rows, err := h.conn.Query(s)
	if err != nil {
		return c.JSON(http.StatusBadRequest, ResponseError(err))
	}
	return c.JSON(http.StatusOK, NewResponseWithData(rows))
}

type Response struct {
	Message string `json:"message"`
	Code    int    `json:"code"`
}

type ResponseWithData struct {
	Response

	Data any `json:"data"`
}

func NewResponse(message string, code int) *Response {
	return &Response{Message: message, Code: code}
}

func NewResponseWithData(data any) *ResponseWithData {
	r := ResponseOk()
	return &ResponseWithData{Response: *r, Data: data}
}

func ResponseOk() *Response {
	return NewResponse("ok", 0)
}

func ResponseError(err error) *Response {
	return NewResponse(err.Error(), 10000)
}

type TableDescription struct {
	Field    string `json:"field"`
	Type     string `json:"type"`
	Nullable bool   `json:"nullable"`
	Primary  bool   `json:"primary"`
	Default  string `json:"default"`
	Extra    string `json:"extra"`
}

func NewTableDescription(data Object) (*TableDescription, error) {
	var res TableDescription
	var err error
	for key, val := range data {
		switch key {
		case "Field":
			res.Field = val.(string)
		case "Type":
			res.Type = val.(string)
		case "Null":
			res.Nullable = val.(string) == "Yes"
		case "Key":
			res.Primary = val.(string) == "PRI"
		case "DEFAULT":
			res.Default = val.(string)
		case "Extra":
			res.Extra = val.(string)
		}
	}

	defer func() {
		if r := recover(); r != nil {
			switch x := r.(type) {
			case string:
				err = errors.New(x)
			case error:
				err = x
			default:
				err = errors.New("unknown panic")
			}
		}
	}()

	return &res, err
}

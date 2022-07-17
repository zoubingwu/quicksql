package service

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/require"
)

func TestHandler_Ping(t *testing.T) {
	db, _, err := sqlmock.New()
	require.Nil(t, err)
	defer db.Close()

	h := NewHandler(db)
	ctx, rec := setupContext("/ping", http.MethodGet, nil)

	require.NoError(t, h.Ping(ctx))
	data := Response{Message: "ok", Code: 0}
	assertJson(t, data, bytes.TrimSpace(rec.Body.Bytes()))
}

func TestHandler_ShowDatabases(t *testing.T) {
	db, mock, err := sqlmock.New()
	require.Nil(t, err)

	h := NewHandler(db)
	ctx, rec := setupContext("/databases", http.MethodGet, nil)

	rows := mock.NewRows([]string{"Database"}).AddRow("mysql").
		AddRow("information_schema").
		AddRow("performance_schema").
		AddRow("sys")

	mock.ExpectQuery("^SHOW DATABASES$").WillReturnRows(rows)

	require.NoError(t, h.ShowDatabases(ctx))
	data := ResponseWithData{
		Response: Response{Message: "ok", Code: 0},
		Data:     []string{"mysql", "information_schema", "performance_schema", "sys"},
	}
	assertJson(t, data, bytes.TrimSpace(rec.Body.Bytes()))
}

func TestHandler_ShowTables(t *testing.T) {
	db, mock, err := sqlmock.New()
	require.Nil(t, err)

	h := NewHandler(db)
	ctx, rec := setupContext("/tables", http.MethodGet, nil)
	ctx.SetParamNames("db")
	ctx.SetParamValues("test_db")

	rows := mock.NewRows([]string{"Tables_in_test_db"}).
		AddRow("users").
		AddRow("user_preferences")

	mock.ExpectQuery("^SHOW TABLES FROM `test_db`$").WillReturnRows(rows)

	require.NoError(t, h.ShowTables(ctx))
	data := ResponseWithData{
		Response: Response{Message: "ok", Code: 0},
		Data:     []string{"users", "user_preferences"},
	}
	assertJson(t, data, bytes.TrimSpace(rec.Body.Bytes()))
}

func TestHandler_DescribeTable(t *testing.T) {
	db, mock, err := sqlmock.New()
	require.Nil(t, err)

	h := NewHandler(db)
	ctx, rec := setupContext("/tables/describe", http.MethodGet, nil)
	ctx.QueryParams().Add("db", "test_db")
	ctx.QueryParams().Add("table", "user")

	rows := mock.NewRows([]string{"Field", "Type", "Null", "Key", "Default", "Extra"}).
		AddRow("id", "int", "NO", "PRI", "NULL", "auto_increment").
		AddRow("name", "varchar(191)", "YES", "", "NULL", "")

	mock.ExpectQuery("^DESCRIBE `test_db`.`user`$").WillReturnRows(rows)

	require.NoError(t, h.DescribeTable(ctx))
	data := ResponseWithData{
		Response: Response{Message: "ok", Code: 0},
		Data: []TableDescription{
			{Field: "id", Type: "int", Nullable: false, Primary: true, Default: "", Extra: "auto_increment"},
			{Field: "name", Type: "varchar(191)", Nullable: true, Primary: false, Default: "", Extra: ""},
		},
	}
	assertJson(t, data, bytes.TrimSpace(rec.Body.Bytes()))
}

func TestHandler_SelectFromTable(t *testing.T) {
	db, mock, err := sqlmock.New()
	require.Nil(t, err)

	h := NewHandler(db)
	ctx, rec := setupContext("/tables/select", http.MethodGet, nil)
	ctx.QueryParams().Add("db", "test_db")
	ctx.QueryParams().Add("table", "user")
	ctx.QueryParams().Add("limit", "2")
	ctx.QueryParams().Add("orderBy", "id")
	ctx.QueryParams().Add("sort", "DESC")

	rows := mock.NewRows([]string{"id", "name"}).
		AddRow(1, "test1").
		AddRow(2, "test2")

	mock.ExpectQuery("^SELECT \\* FROM `test_db`.`user` ORDER BY `id` DESC LIMIT 2$").WillReturnRows(rows)

	require.NoError(t, h.SelectFromTable(ctx))
	data := ResponseWithData{
		Response: Response{Message: "ok", Code: 0},
		Data: []struct {
			Id   string `json:"id"`
			Name string `json:"name"`
		}{
			{Id: "1", Name: "test1"},
			{Id: "2", Name: "test2"},
		},
	}
	assertJson(t, data, bytes.TrimSpace(rec.Body.Bytes()))
}

func TestHandler_ExecQuery(t *testing.T) {
	db, mock, err := sqlmock.New()
	require.Nil(t, err)

	h := NewHandler(db)
	ctx, rec := setupContext("/sql", http.MethodPost, strings.NewReader(`{"query":"SELECT * FROM test_db.user ORDER BY id DESC LIMIT 2"}`))
	rows := mock.NewRows([]string{"id", "name"}).
		AddRow(1, "test1").
		AddRow(2, "test2")

	mock.ExpectQuery("^SELECT \\* FROM test_db.user ORDER BY id DESC LIMIT 2$").WillReturnRows(rows)

	require.NoError(t, h.ExecQuery(ctx))
	data := ResponseWithData{
		Response: Response{Message: "ok", Code: 0},
		Data: []struct {
			Id   string `json:"id"`
			Name string `json:"name"`
		}{
			{Id: "1", Name: "test1"},
			{Id: "2", Name: "test2"},
		},
	}
	assertJson(t, data, bytes.TrimSpace(rec.Body.Bytes()))
}

func setupContext(path string, method string, body io.Reader) (echo.Context, *httptest.ResponseRecorder) {
	e := echo.New()
	req := httptest.NewRequest(method, "/", body)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	ctx.SetPath("/api" + path)

	return ctx, rec
}

func assertJson(t *testing.T, expected interface{}, actual []byte) {
	expect, err := json.Marshal(expected)
	require.Nil(t, err)
	require.Equal(t, expect, actual)
}

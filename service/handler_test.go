package service

import (
	"database/sql"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/require"
)

var (
	dsn = "root@tcp(localhost:3306)/test_db"
)

func TestHandler_Ping(t *testing.T) {
	db, _ := sql.Open("mysql", dsn)
	h := NewHandlers(db)
	ctx, rec := setupContext("/ping", http.MethodGet, nil)

	require.NoError(t, h.Ping(ctx))
	require.Equal(t, http.StatusOK, rec.Code)

	var data map[string]any
	require.NoError(t, json.Unmarshal(rec.Body.Bytes(), &data))
	require.Equal(t, "ok", data["message"])
	require.Equal(t, float64(0), data["code"])
}

func TestHandler_ShowDatabases(t *testing.T) {
	db, _ := sql.Open("mysql", dsn)
	h := NewHandlers(db)
	ctx, rec := setupContext("/databases", http.MethodGet, nil)

	require.NoError(t, h.ShowDatabases(ctx))
	require.Equal(t, http.StatusOK, rec.Code)

	var data map[string]any
	require.NoError(t, json.Unmarshal(rec.Body.Bytes(), &data))
	require.Equal(t, "ok", data["message"])
	require.Equal(t, float64(0), data["code"])
	require.Equal(t, true, len(data["data"].([]any)) > 0)
}

func TestHandler_ShowTables(t *testing.T) {
	db, _ := sql.Open("mysql", dsn)
	h := NewHandlers(db)
	ctx, rec := setupContext("/tables", http.MethodGet, nil)
	ctx.SetParamNames("db")
	ctx.SetParamValues("test_db")

	require.NoError(t, h.ShowTables(ctx))
	require.Equal(t, http.StatusOK, rec.Code)

	var data map[string]any
	require.NoError(t, json.Unmarshal(rec.Body.Bytes(), &data))
	require.Equal(t, "ok", data["message"])
	require.Equal(t, float64(0), data["code"])
	require.Equal(t, true, len(data["data"].([]any)) > 0)
}

func TestHandler_DescribeTable(t *testing.T) {
	db, _ := sql.Open("mysql", dsn)
	h := NewHandlers(db)
	ctx, rec := setupContext("/tables/describe", http.MethodGet, nil)
	ctx.QueryParams().Add("db", "test_db")
	ctx.QueryParams().Add("table", "user")

	require.NoError(t, h.DescribeTable(ctx))
	require.Equal(t, http.StatusOK, rec.Code)

	var data map[string]any
	require.NoError(t, json.Unmarshal(rec.Body.Bytes(), &data))
	require.Equal(t, "ok", data["message"])
	require.Equal(t, float64(0), data["code"])
	require.Equal(t, true, len(data["data"].([]any)) > 0)
}

func TestHandler_SelectFromTable(t *testing.T) {
	db, _ := sql.Open("mysql", dsn)
	h := NewHandlers(db)
	ctx, rec := setupContext("/tables/select", http.MethodGet, nil)
	ctx.QueryParams().Add("db", "test_db")
	ctx.QueryParams().Add("table", "user")
	ctx.QueryParams().Add("limit", "2")
	ctx.QueryParams().Add("orderBy", "id")
	ctx.QueryParams().Add("sort", "DESC")

	require.NoError(t, h.SelectFromTable(ctx))
	require.Equal(t, http.StatusOK, rec.Code)
	var data map[string]any
	require.NoError(t, json.Unmarshal(rec.Body.Bytes(), &data))
	require.Equal(t, "ok", data["message"])
	require.Equal(t, float64(0), data["code"])
	require.Equal(t, 2, len(data["data"].([]any)))
}

func setupContext(path string, method string, body io.Reader) (echo.Context, *httptest.ResponseRecorder) {
	e := echo.New()
	req := httptest.NewRequest(method, "/", body)
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	ctx := e.NewContext(req, rec)
	ctx.SetPath(path)

	return ctx, rec
}

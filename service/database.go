package service

import (
	"database/sql"

	_ "github.com/go-sql-driver/mysql"
	"github.com/samber/lo"
)

type Connection struct {
	db *sql.DB
}

func (c *Connection) Query(s string) ([]Object, error) {
	rows, err := c.db.Query(s)
	if err != nil {
		return nil, err
	}

	columnTypes, err := rows.ColumnTypes()
	if err != nil {
		return nil, err
	}

	count := len(columnTypes)
	var finalRows []Object

	for rows.Next() {
		scanArgs := make([]any, count)

		for i, v := range columnTypes {
			switch v.DatabaseTypeName() {
			case "VARCHAR", "TEXT", "UUID", "TIMESTAMP":
				scanArgs[i] = new(sql.NullString)
				break
			case "BOOL":
				scanArgs[i] = new(sql.NullBool)
				break
			case "INT":
				scanArgs[i] = new(sql.NullInt64)
				break
			case "DOUBLE":
				scanArgs[i] = new(sql.NullFloat64)
				break
			default:
				scanArgs[i] = new(sql.NullString)
			}
		}

		err := rows.Scan(scanArgs...)
		if err != nil {
			return nil, err
		}

		data := map[string]any{}
		for i, v := range columnTypes {
			if z, ok := (scanArgs[i]).(*sql.NullBool); ok {
				data[v.Name()] = z.Bool
				continue
			}

			if z, ok := (scanArgs[i]).(*sql.NullString); ok {
				data[v.Name()] = z.String
				continue
			}

			if z, ok := (scanArgs[i]).(*sql.NullInt64); ok {
				data[v.Name()] = z.Int64
				continue
			}

			if z, ok := (scanArgs[i]).(*sql.NullFloat64); ok {
				data[v.Name()] = z.Float64
				continue
			}

			if z, ok := (scanArgs[i]).(*sql.NullInt32); ok {
				data[v.Name()] = z.Int32
				continue
			}

			data[v.Name()] = scanArgs[i]
		}

		finalRows = append(finalRows, data)
	}

	return finalRows, nil
}

func (c *Connection) ShowDatabases() ([]string, error) {
	rows, err := c.Query("SHOW DATABASES")
	if err != nil {
		return nil, err
	}

	return lo.Map[Object, string](rows, func(t Object, i int) string {
		if t, ok := rows[i]["Database"].(string); ok {
			return t
		}
		return ""
	}), nil
}

func (c *Connection) ShowTables() ([]Object, error) {
	rows, err := c.Query("SHOW TABLES")
	if err != nil {
		return nil, err
	}

	return rows, nil
}

func (c *Connection) Close() {
	c.db.Close()
}

func (c *Connection) Ping() error {
	return c.db.Ping()
}

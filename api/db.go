package main

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"os"
)

func QueryDb(query string, args ...interface{}) (*sql.Rows, error) {
	psSqlInfo := os.Getenv("DB_CREDENTIALS")
	db, err := sql.Open("postgres", psSqlInfo)
	if err != nil {
		return nil, fmt.Errorf("failed to open db connection: %w", err)
	}
	defer db.Close()

	stmt, err := db.Prepare(query)
	if err != nil {
		return nil, fmt.Errorf("failed to prepare query statement: %w", err)
	}

	rows, err := stmt.Query(args...)
	if err != nil {
		return nil, fmt.Errorf("database query failed: %w", err)
	}

	return rows, nil
}

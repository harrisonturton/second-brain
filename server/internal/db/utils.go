package db

import (
	"database/sql"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
)

const (
	port       = 5432
	user       = "postgres"
	host       = "localhost"
	MainDbName = "second_brain"
	TestDbName = "test_second_brain"
)

func InitDb(dbName string) error {
	scriptPath := filepath.Join("..", "db", "init_db.sh")
	cmd := exec.Command("bash", scriptPath, user, host, strconv.Itoa(port), dbName)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func DestroyDb(dbName string) error {
	scriptPath := filepath.Join("..", "db", "drop_db.sh")
	cmd := exec.Command("bash", scriptPath, user, host, strconv.Itoa(port), dbName)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func OpenConn(dbName string) (*sql.DB, error) {
	var url = fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=disable", user, user, host, port, dbName)
	return sql.Open("postgres", url)
}

package db

import (
	"os"
	"os/exec"
	"path/filepath"
)

func InitDb() error {
	scriptPath := filepath.Join("..", "db", "init_db.sh")
	cmd := exec.Command("bash", scriptPath)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func DestroyDb() error {
	scriptPath := filepath.Join("..", "db", "drop_db.sh")
	cmd := exec.Command("bash", scriptPath)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

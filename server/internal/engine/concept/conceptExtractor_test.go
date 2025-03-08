package concept

import (
	"github.com/stretchr/testify/assert"
	"os"
	"path/filepath"
	"testing"
)

const (
	abstractFile = "abstract.txt"
)

// Helper function to read a file from testdata
func loadTestData(fileName string, t *testing.T) string {
	t.Helper()
	path := filepath.Join("testdata", fileName)

	data, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("Failed to read test file: %v", err)
	}

	return string(data)
}

func TestGenerate(t *testing.T) {
	abstract := loadTestData(abstractFile, t)

	res, err := Extract("name", "description", abstract)
	assert.NoError(t, err)

	assert.Equal(t, "name", res.Name)
	assert.Equal(t, "description", res.Description)
	assert.NotEmpty(t, res.Concepts)
}

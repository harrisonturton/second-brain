package abstract

import (
	"github.com/stretchr/testify/assert"
	"os"
	"path/filepath"
	"testing"
)

const (
	responseFile = "response.txt"
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
	response := loadTestData(responseFile, t)

	abstracts, err := Generate(response)
	assert.NoError(t, err)

	keys := []string{
		"primary school student",
		"high school student",
		"undergraduate student",
		"PhD student",
		"professor",
	}
	for _, key := range keys {
		value, exists := abstracts[key]
		assert.True(t, exists, "Map should contain key %s", key)
		assert.NotEmpty(t, value, "Value should not be empty")
	}
}

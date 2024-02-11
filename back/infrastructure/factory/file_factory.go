package factory

import (
	"os"
)

type FileFactory struct {}

func NewFileFactory() *FileFactory {
	return &FileFactory{}
}

func (f *FileFactory) CreateFile(filePath string, content []byte) (err error) {
	err = os.WriteFile(filePath, content, 0644)
	return 
}
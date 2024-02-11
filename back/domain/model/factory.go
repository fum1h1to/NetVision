package model

import (

)

type IFileFactory interface {
	CreateFile(filePath string, content []byte) (err error)
}


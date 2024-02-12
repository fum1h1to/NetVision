package model

import (
	"github.com/gorilla/websocket"
)

type IFileFactory interface {
	CreateFile(filePath string, content []byte) (err error)
}

type IClientFactory interface {
	CreateClient(ws *websocket.Conn) (client *Client)
}


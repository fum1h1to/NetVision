package factory

import (
	"github.com/gorilla/websocket"
	
	"NetVision/domain/model"
)

type ClientFactory struct {
	id_increment int
}

func NewClientFactory() *ClientFactory {
	return &ClientFactory{
		id_increment: 0,
	}
}

func (c *ClientFactory) CreateClient(ws *websocket.Conn) (client *model.Client) {
	client := model.NewClient(c.id_increment, ws)

	c.id_increment += 1

	return 
}
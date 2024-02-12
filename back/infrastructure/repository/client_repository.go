package repository

import (
	"NetVision/domain/model"
)

type ClientRepository struct {
	clients		map[int]*model.Client
}

func NewClientRepository() *ClientRepository {

	return &ClientRepository{
		clients: make(map[int]*model.Client),
	}
}

func (c *ClientRepository) RegisterClient(client *model.Client) {
	c.clients[client.Id] = client
}

func (c *ClientRepository) UnRegisterClient(client *model.Client) {
	delete(c.clients, client.Id)
}


package service

import (
	"log"

	"NetVision/domain/model"
)

type ClientService struct {
}

func NewClientService() *ClientService {
	return &ClientService{}
}

func (c *ClientService) CheckClose(client model.Client) {

}
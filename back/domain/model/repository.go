package model

import (
)

type IClientRepository interface {
	RegisterClient(client *Client)
	UnRegisterClient(client *Client)
}


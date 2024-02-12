package domain

import (

)

// こいつってドメインオブジェクト？インフラ？
type PacketDataStream struct {
	RegisterCh   chan *Client
	UnRegisterCh chan *Client
	BroadcastCh  chan []*PacketData
}

func NewHub() *Hub {
	return &Hub{
		Clients:      make(map[*Client]bool),
		RegisterCh:   make(chan *Client),
		UnRegisterCh: make(chan *Client),
		BroadcastCh:  make(chan []byte),
	}
}

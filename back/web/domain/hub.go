package domain

type Hub struct {
	Clients		map[*Client]bool
	RegisterCh   chan *Client
	UnRegisterCh chan *Client
	BroadcastCh  chan []byte
}

func NewHub() *Hub {
	return &Hub{
		Clients:      make(map[*Client]bool),
		RegisterCh:   make(chan *Client),
		UnRegisterCh: make(chan *Client),
		BroadcastCh:  make(chan []byte),
	}
}

func (h *Hub) RunLoop() {
	for {
		select {
		case client := <-h.RegisterCh:
			h.register(client)

		case client := <-h.UnRegisterCh:
			h.unregister(client)

		case message := <-h.BroadcastCh:
			h.broadCastToAllClient(message)
		}
	}
}

func (h *Hub) register(client *Client) {
	h.Clients[client] = true
}

func (h *Hub) unregister(client *Client) {
	delete(h.Clients, client)
}

func (h *Hub) broadCastToAllClient(message []byte) {
	for c := range h.Clients {
		c.SendCh <- message
	}
}
package handlers

import (
	"log"
	"net/http"

	"DarkVision/web/domain"
	"github.com/gorilla/websocket"
)

type WebsocketHandler struct {
	hub *domain.Hub
}

func NewWebsocketHandler(hub *domain.Hub) *WebsocketHandler {
	return &WebsocketHandler{
		hub: hub,
	}
}

func (h *WebsocketHandler) Handle(w http.ResponseWriter, r *http.Request) {
	upgrader := &websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error: %s", err)
		return
	}

	client := domain.NewClient(ws)
	go client.WriteLoop()
	go client.CheckClose(h.hub.UnRegisterCh)
	h.hub.RegisterCh <- client
}
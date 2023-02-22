package server

import (
	"fmt"
	"log"
	"net/http"

	"DarkVision/configs"
	"DarkVision/web/domain"
	"DarkVision/web/handlers"
)

type WebServer struct {
	Hub *domain.Hub
}

func CreateServer() *WebServer {
	hub := domain.NewHub()
	return &WebServer{
		Hub: hub,
	}
}

func (w *WebServer) StartServer() {
	go w.Hub.RunLoop()

	http.HandleFunc("/ws", handlers.NewWebsocketHandler(w.Hub).Handle) 

	port := configs.SERVER_PORT
	log.Printf("Listening on port %d", port)

	if err := http.ListenAndServe(fmt.Sprintf(":%v", port), nil); err != nil {
		log.Panicln("Server Error:", err)
	}
}
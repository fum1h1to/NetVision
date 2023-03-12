package server

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

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

	w.createWebsocketData()
	http.HandleFunc("/", http.FileServer(http.Dir(configs.GetServerClientContentPath())).ServeHTTP)
	http.HandleFunc("/ws", handlers.NewWebsocketHandler(w.Hub).Handle)

	port := configs.GetServerPort()
	log.Printf("Listening on port %d", port)

	if err := http.ListenAndServe(fmt.Sprintf(":%v", port), nil); err != nil {
		log.Panicln("Server Error:", err)
	}
}

type serverData struct {
	Server struct {
		Port          int    `json:"port"`
		Host          string `json:"host"`
		WebsocketPath string `json:"websocket_path"`
	} `json:"server"`
}

func (w *WebServer) createWebsocketData() {
	serverData := new(serverData)
	serverData.Server.Port = configs.GetServerPort()
	serverData.Server.Host = configs.GetServerIP()
	serverData.Server.WebsocketPath = "/ws"

	jsonData, err := json.Marshal(serverData)
	if err != nil {
		log.Panicln("Error: ", err)
		return
	}
	err = os.WriteFile(configs.GetServerClientContentPath() + "/data/server.json", jsonData, 0644)
	if err != nil {
		log.Panicln("Error: ", err)
		return
	}
}
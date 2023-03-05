package main

import (
	// "fmt"
	"encoding/json"

	"DarkVision/network"
	"DarkVision/web/server"
)

func main() {
	webserver := server.CreateServer()
	go webserver.StartServer()
	
	packetDataOutputChan := make(chan []*network.PacketData)
	go network.StartCapturing(packetDataOutputChan)

	for {
		select {
		case packetData := <- packetDataOutputChan:
			json_data, _ := json.Marshal(packetData)
			webserver.Hub.BroadcastCh <- json_data
		}
	}
}
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
	
	exchangeDataOutputChan := make(chan []*network.ExchangeStruct)
	go network.StartCapturing(exchangeDataOutputChan)

	for {
		select {
		case exchangeData := <- exchangeDataOutputChan:
			json_data, _ := json.Marshal(exchangeData)
			webserver.Hub.BroadcastCh <- json_data
		}
	}
}
package main

import (
	"fmt"
	"DarkVision/network"
)

func main() {
	exchangeDataOutputChan := make(chan []*network.ExchangeStruct)

	go network.StartCapturing(exchangeDataOutputChan)

	for {
		select {
		case exchangeData := <- exchangeDataOutputChan:
			fmt.Println(exchangeData)
		}
	}
}
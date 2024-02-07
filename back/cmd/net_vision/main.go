package main

import (
	"log"
)

func main() {
	
	_, err := InitContainer("./config.yaml")
	if err != nil {
		log.Printf("Error: %s", err)
	}

	// webserver := container.Presentation.ServerController
	// webserver.StartServer()

}
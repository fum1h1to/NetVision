package main

import (
	"log"
)

func main() {
	
	container, err := InitContainer("./config.yaml")
	if err != nil {
		log.Printf("Error: %s", err)
	}

	// webserver := container.Presentation.ServerController
	// webserver.StartServer()

}
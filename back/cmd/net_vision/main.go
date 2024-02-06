package main

import (
	"log"

	"NetVision/presentation/dependency"
)

func main() {
	
	container, err := dependency.InitContainer()
	if err != nil {
		log.Printf("Error: %s", err)
	}

	// webserver := container.Presentation.ServerController
	// webserver.StartServer()

}
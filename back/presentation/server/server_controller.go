package server

import (
	"NetVision/application"
)

type ServerController struct {
	serverApplicationService *application.ServerApplicationService
}

func NewServerController(
	serverApplicationService *application.ServerApplicationService,
) *ServerController {
	return &ServerController{
		serverApplicationService: serverApplicationService,
	}
}

func (s *ServerController) SetupServer() {
	s.serverApplicationService.SetupServer()
}

func (s *ServerController) StartServer() {
	s.serverApplicationService.StartServer()
}


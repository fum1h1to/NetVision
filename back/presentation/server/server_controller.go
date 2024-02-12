package server

import (
	// "NetVision/application"
)

type ServerController struct {
	// TODO:
	// ServerControllerにapplicationを持たせようとすると、wireでエラーが出る。
	// server_application_service *application.ServerApplicationService
}

func NewServerController(
	// server_application_service *application.ServerApplicationService,
) *ServerController {
	return &ServerController{
		// server_application_service: server_application_service,
	}
}

// func (s *ServerController) SetupServer() {
// 	s.server_application_service.SetupServer()
// }

// func (s *ServerController) StartServer() {
// 	s.server_application_service.StartServer()
// }


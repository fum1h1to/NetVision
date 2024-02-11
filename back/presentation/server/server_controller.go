package server

import (
	"NetVision/domain/service"
)

type ServerController struct {
	configuration_service *service.ConfigurationGenerateService
}

func NewServerController(
	configuration_service *service.ConfigurationGenerateService,
) *ServerController {
	return &ServerController{
		configuration_service: configuration_service,
	}
}

func (s *ServerController) StartServer() {
	s.configuration_service.GenerateServerConfig()
	s.configuration_service.GenerateClientConfig()
}


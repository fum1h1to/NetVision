package application

import (
	"NetVision/domain/model/configuration"
	"NetVision/domain/service"
)

type ServerApplicationService struct {
	appConfig *configuration.AppConfiguration
	configurationService *service.ConfigurationService
}

func NewServerApplicationService(
	appConfig *configuration.AppConfiguration,
	configurationService *service.ConfigurationService,
) *ServerApplicationService {
	return &ServerApplicationService{
		appConfig: appConfig,
		configurationService: configurationService,
	}
}

func (s *ServerApplicationService) SetupServer() {
	s.configurationService.GenerateServerConfig()
	s.configurationService.GenerateClientConfig()
}

func (s *ServerApplicationService) StartServer() {
	
}



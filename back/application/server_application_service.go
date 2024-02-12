package application

import (
	"NetVision/domain/model/configuration"
	"NetVision/domain/service"
)

type ServerApplicaitonService struct {
	appConfig *configuration.AppConfiguration
	configurationService *service.ConfigurationService
}

func NewServerApplicaitonService(
	appConfig *configuration.AppConfiguration,
	configurationService *service.ConfigurationService,
) *ServerApplicaitonService {
	return &ServerApplicaitonService{
		appConfig: appConfig,
		configurationService: configurationService,
	}
}

func (s *ServerApplicaitonService) SetupServer() {
	s.configurationService.GenerateServerConfig()
	s.configurationService.GenerateClientConfig()
}

func (s *ServerApplicaitonService) StartServer() {
	
}



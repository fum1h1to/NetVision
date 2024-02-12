package application

import (
	"NetVision/domain/model/configuration"
	"NetVision/domain/service"
)

type ServerApplicaitonService struct {
	appConfig *configuration.AppConfiguration
	configuration_generate_service *service.ConfigurationGenerateService
}

func NewServerApplicaitonService(
	appConfig *configuration.AppConfiguration,
	configuration_generate_service *service.ConfigurationGenerateService,
) *ServerApplicaitonService {
	return &ServerApplicaitonService{
		appConfig: appConfig,
		configuration_generate_service: configuration_generate_service,
	}
}

func (s *ServerApplicaitonService) SetupServer() {
	s.configuration_generate_service.GenerateServerConfig()
	s.configuration_generate_service.GenerateClientConfig()
}

func (s *ServerApplicaitonService) StartServer() {
	
}



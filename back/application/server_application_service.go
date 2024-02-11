package application

import (
	"NetVision/domain/model/app_configuration"
)

type ServerApplicaitonService struct {
	appConfig *app_configuration.AppConfiguration
}

func NewServerApplicaitonService(
	appConfig *app_configuration.AppConfiguration,
) *ServerApplicaitonService {
	return &ServerApplicaitonService{
		appConfig: appConfig,
	}
}

func (s *ServerApplicaitonService) CreateServerSetting() {
	
}

func (s *ServerApplicaitonService) CreateClientSetting() {
	
}

func (s *ServerApplicaitonService) StartServer() {
	
}



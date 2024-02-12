package application

import (
	"log"
	"net/http"
	"github.com/gorilla/websocket"
	
	"NetVision/domain/model/configuration"
	"NetVision/domain/model"
	"NetVision/domain/service"
)

type ServerApplicationService struct {
	appConfig *configuration.AppConfiguration
	configurationService *service.ConfigurationService
	clientfactory model.IClientFactory
}

func NewServerApplicationService(
	appConfig *configuration.AppConfiguration,
	configurationService *service.ConfigurationService,
	clientFactory model.IClientFactory,
) *ServerApplicationService {
	return &ServerApplicationService{
		appConfig: appConfig,
		configurationService: configurationService,
		clientFactory: clientFactory
	}
}

func (s *ServerApplicationService) SetupServer() {
	s.configurationService.GenerateServerConfig()
	s.configurationService.GenerateClientConfig()
}

func (s *ServerApplicationService) StartServer() {
	
}

func (s *ServerApplicationService) WebsocketHandle(w http.ResponseWriter, r *http.Request) {
	upgrader := &websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error: %s", err)
		return
	}

	client := s.clientFactory.CreateClient(ws)

}


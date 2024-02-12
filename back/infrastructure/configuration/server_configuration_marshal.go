package configuration

import (
	"encoding/json"

	"NetVision/domain/model/configuration"
)

type serverConfigurationField struct {
	Server struct {
		Host          string `json:"host"`
		Port          int    `json:"port"`
		// TODO:
		// websocketpathはendpointという名称に変えたい
		WebsocketPath string `json:"websocket_path"`
	} `json:"server"`
}

type ServerConfigurationMarshal struct {
	appConfig *configuration.AppConfiguration
}

func NewServerConfigurationMarshal(
	appConfig *configuration.AppConfiguration,
) *ServerConfigurationMarshal {
	return &ServerConfigurationMarshal{
		appConfig: appConfig,
	}
}


func (s *ServerConfigurationMarshal) Marshal() (marshal_string []byte, err error) {
	serverConfig := new(serverConfigurationField)
	serverConfig.Server.Host = s.appConfig.Backend.ServerIP.String()
	serverConfig.Server.Port = s.appConfig.Backend.ServerPort
	serverConfig.Server.WebsocketPath = "ws"

	marshal_string, err = json.Marshal(serverConfig)

	return
}

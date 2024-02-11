package configuration

import (
	"encoding/json"

	app_configuration_model "NetVision/domain/model/app_configuration"
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
	appConfig *app_configuration_model.AppConfiguration
}

func NewServerConfigurationMarshal(
	appConfig *app_configuration_model.AppConfiguration,
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

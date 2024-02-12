package service

import (
	"log"
	"path/filepath"

	"NetVision/domain/model"
	"NetVision/domain/model/configuration"
)

type IServerConfigurationMarshal interface {
	Marshal() (marshal_string []byte, err error)
}

type IClientConfigurationMarshal interface {
	Marshal() (marshal_string []byte, err error)
}

type ConfigurationGenerateService struct {
	appConfig *configuration.AppConfiguration
	serverConfigurationGenerator IServerConfigurationMarshal
	clientConfigurationGenerator IClientConfigurationMarshal
	fileFactory model.IFileFactory
}

func NewConfigurationGenerateService(
	appConfig *configuration.AppConfiguration,
	serverConfigurationGenerator IServerConfigurationMarshal,
	clientConfigurationGenerator IClientConfigurationMarshal,
	fileFactory model.IFileFactory,
) *ConfigurationGenerateService {
	return &ConfigurationGenerateService{
		appConfig: appConfig,
		serverConfigurationGenerator: serverConfigurationGenerator,
		clientConfigurationGenerator: clientConfigurationGenerator,
		fileFactory: fileFactory,
	}
}

func (c *ConfigurationGenerateService) GenerateServerConfig() {

	content, err := c.serverConfigurationGenerator.Marshal()
	if err != nil {
		log.Panicln("Error marshaling server config:", err)
	}

	filePath := filepath.Join(c.appConfig.Backend.ServerClientContentPath, "/data/server.json")
	err = c.fileFactory.CreateFile(filePath, content)
	if err != nil {
		log.Panicln("Error creating server config file:", err)
	}

	log.Printf("Server config file created: %s", filePath)
}

func (c *ConfigurationGenerateService) GenerateClientConfig() {

	content, err := c.clientConfigurationGenerator.Marshal()
	if err != nil {
		log.Panicln("Error marshaling client config:", err)
	}

	filePath := filepath.Join(c.appConfig.Backend.ServerClientContentPath, "/data/setting.json")
	err = c.fileFactory.CreateFile(filePath, content)
	if err != nil {
		log.Panicln("Error creating client config file:", err)
	}

	log.Printf("Client config file created: %s", filePath)
}

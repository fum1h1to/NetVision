// Code generated by Wire. DO NOT EDIT.

//go:generate go run -mod=mod github.com/google/wire/cmd/wire
//go:build !wireinject
// +build !wireinject

package main

import (
	"NetVision/application"
	"NetVision/domain/model"
	configuration2 "NetVision/domain/model/configuration"
	"NetVision/domain/service"
	"NetVision/infrastructure/configuration"
	"NetVision/infrastructure/factory"
	"NetVision/presentation/capture"
	"NetVision/presentation/server"
	"github.com/google/wire"
)

// Injectors from wire.go:

func InitContainer(filePath string) (*Container, error) {
	appConfiguration := configuration.LoadAppConfig(filePath)
	captureController := capture.NewCaptureController()
	serverController := server.NewServerController()
	serverConfigurationMarshal := configuration.NewServerConfigurationMarshal(appConfiguration)
	clientConfigurationMarshal := configuration.NewClientConfigurationMarshal(appConfiguration)
	fileFactory := factory.NewFileFactory()
	configurationGenerateService := service.NewConfigurationGenerateService(appConfiguration, serverConfigurationMarshal, clientConfigurationMarshal, fileFactory)
	serverApplicaitonService := application.NewServerApplicaitonService(appConfiguration, configurationGenerateService)
	container := &Container{
		AppConfig:                appConfiguration,
		CaptureController:        captureController,
		ServerController:         serverController,
		ServerApplicaitonService: serverApplicaitonService,
	}
	return container, nil
}

// wire.go:

// infrastructure
var infrastructureSet = wire.NewSet(configuration.LoadAppConfig, configuration.NewServerConfigurationMarshal, wire.Bind(new(service.IServerConfigurationMarshal), new(*configuration.ServerConfigurationMarshal)), configuration.NewClientConfigurationMarshal, wire.Bind(new(service.IClientConfigurationMarshal), new(*configuration.ClientConfigurationMarshal)), factory.NewFileFactory, wire.Bind(new(model.IFileFactory), new(*factory.FileFactory)))

// domain service
var domainServiceSet = wire.NewSet(service.NewConfigurationGenerateService)

// application
var applicationSet = wire.NewSet(application.NewServerApplicaitonService)

// presentation
var presentationSet = wire.NewSet(capture.NewCaptureController, server.NewServerController)

type Container struct {
	AppConfig                *configuration2.AppConfiguration
	CaptureController        *capture.CaptureController
	ServerController         *server.ServerController
	ServerApplicaitonService *application.ServerApplicaitonService
}
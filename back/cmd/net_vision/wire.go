//go:build wireinject
// +build wireinject

package main

import (
    "github.com/google/wire"

		"NetVision/presentation/capture"
		"NetVision/presentation/server"

		"NetVision/application"

		configuration_model "NetVision/domain/model/configuration"
		domain_model "NetVision/domain/model"

		domain_service "NetVision/domain/service"

		infra_configuration "NetVision/infrastructure/configuration"
		infra_factory "NetVision/infrastructure/factory"

)

// infrastructure
var infrastructureSet = wire.NewSet(
	infra_configuration.LoadAppConfig,
	infra_configuration.NewServerConfigurationMarshal,
	wire.Bind(new(domain_service.IServerConfigurationMarshal), new(*infra_configuration.ServerConfigurationMarshal)),
	infra_configuration.NewClientConfigurationMarshal,
	wire.Bind(new(domain_service.IClientConfigurationMarshal), new(*infra_configuration.ClientConfigurationMarshal)),
	infra_factory.NewFileFactory,
	wire.Bind(new(domain_model.IFileFactory), new(*infra_factory.FileFactory)),
)

// domain service
var domainServiceSet = wire.NewSet(
	domain_service.NewConfigurationGenerateService,
)

// application
var applicationSet = wire.NewSet(
	application.NewServerApplicaitonService,
)

// presentation
var presentationSet = wire.NewSet(
	capture.NewCaptureController,
	server.NewServerController,
)

type Container struct {
	AppConfig *configuration_model.AppConfiguration
	CaptureController *capture.CaptureController
	ServerController *server.ServerController
	ServerApplicaitonService *application.ServerApplicaitonService
}

func InitContainer(filePath string) (*Container, error) {
	wire.Build(
		infrastructureSet,
		domainServiceSet,
		applicationSet,
		presentationSet,
		wire.Struct(new(Container), "*"),
	)
	return nil, nil
}


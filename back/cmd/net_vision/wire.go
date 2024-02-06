//go:build wireinject
// +build wireinject

package main

import (
    "github.com/google/wire"

		"NetVision/presentation/capture"
		"NetVision/presentation/server"
		app_configuration_model "NetVision/domain/model/app_configuration"
		app_configuration_loader "NetVision/infrastructure/app_configuration"

)

// infrastructure
var infrastructureSet = wire.NewSet(
	app_configuration_loader.LoadAppConfig,
)

// repository
// var repositorySet = wire.NewSet(
//     repository.NewActivityRepository,
// )

// usecase
// var usecaseSet = wire.NewSet(
//     usecase.NewActivityUsecase,
// )

// presentation
var presentationSet = wire.NewSet(
	capture.NewCaptureController,
	server.NewServerController,
)

type Container struct {
	AppConfig *app_configuration_model.AppConfiguration
	CaptureController *capture.CaptureController
	ServerController *server.ServerController
}

func InitContainer(filePath string) (*Container, error) {
	wire.Build(
		infrastructureSet,
		presentationSet,
		wire.Struct(new(Container), "*"),
	)
	return nil, nil
}



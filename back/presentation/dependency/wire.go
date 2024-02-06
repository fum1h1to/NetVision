//go:build wireinject
// +build wireinject

package dependency

import (
    "github.com/google/wire"
		"NetVision/presentation/capture"
		// "NetVision/presentation/handler"
		"NetVision/presentation/server"
)

// infrastructure
// var infrastructureSet = wire.NewSet(
//     database.InitDB,
// )

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
    Presentation struct {
				CaptureController capture.CaptureController
				ServerController server.ServerController
		}
}

func InitContainer() (*Container, error) {
    wire.Build(
			presentationSet,
			wire.Struct(new(Container), "*"),
    )
    return nil, nil
}



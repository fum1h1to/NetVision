package configuration

import (
	"NetVision/domain/model/configuration/components"
)

type AppConfiguration struct {
	Backend components.BackendSetting
	Frontend components.FrontendSetting
	Geoip components.GeoipSetting
	Network components.NetworkSetting
	ThreatDB components.ThreatDBSetting
	Visualization components.VisualizationSetting
}


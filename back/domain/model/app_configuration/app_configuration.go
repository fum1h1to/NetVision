package app_configuration

import (
	"NetVision/domain/model/app_configuration/components"
)

type AppConfiguration struct {
	Backend components.BackendSetting
	Frontend components.FrontendSetting
	Geoip components.GeoipSetting
	Network components.NetworkSetting
	ThreatDB struct {
		AbuseIP components.AbuseIPSetting
		Spamhaus components.SpamhausSetting
		BlocklistDe components.BlocklistDe
	}
	Visualization components.VisualizationSetting
}


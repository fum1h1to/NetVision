package app_configuration

import (
	"log"
	"os"

  "gopkg.in/yaml.v2"
	"net/netip"

	domain_model "NetVision/domain/model"
	app_configuration_model "NetVision/domain/model/app_configuration"
	app_configuration_components "NetVision/domain/model/app_configuration/components"
)

type appConfigurationField struct {
	// backendの設定
	ServerIP string `yaml:"SERVER_IP"`
	ServerPort int `yaml:"SERVER_PORT"`
	ServerClientContentPath string `yaml:"SERVER_CLIENT_CONTENT_PATH"`
	ServerAutoOpenBrowser bool `yaml:"SERVER_AUTO_OPEN_BROWSER"`

	// frontendの設定
	ApplicationReloadInterval int `yaml:"APPLICATION_RELOAD_INTERVAL"`
	WebsocketReconnectInterval int `yaml:"WEBSOCKET_RECONNECT_INTERVAL"`

	// GeoIPの設定
	GeoipDbOutputPath string `yaml:"GEOIP_DB_OUTPUT_PATH"`
	GeoipDbPath string `yaml:"GEOIP_DB_PATH"`

	// AbuseIPDBの設定
	UseAbuseIPDB bool `yaml:"USE_ABUSE_IPDB"`
	AbuseIPDBUpdateDuration int `yaml:"ABUSE_IPDB_UPDATE_DURATION"`
	AbuseIPDBAPIKey string `yaml:"ABUSE_IPDB_API_KEY"`
	AbuseIPDBBlacklistPath string `yaml:"ABUSE_IPDB_BLACKLIST_PATH"`
	AbuseIPDBPacketColor struct {
		R int `yaml:"R"`
		G int `yaml:"G"`
		B int `yaml:"B"`
	} `yaml:"ABUSE_IPDB_PACKET_COLOR"`
	AbuseIPDBModelFileName string `yaml:"ABUSE_IPDB_MODEL_FILE_NAME"`
	AbuseIPDBThresholdConfidenceScore int `yaml:"ABUSE_IPDB_THRESHOLD_CONFIDENCE_SCORE"`

	// Spamhausの設定
	UseSpamhaus bool `yaml:"USE_SPAMHAUS"`
	SpamhausDataOutputPath string `yaml:"SPAMHAUS_DATA_OUTPUT_PATH"`
	SpamhausPacketColor struct {
		R int `yaml:"R"`
		G int `yaml:"G"`
		B int `yaml:"B"`
	} `yaml:"SPAMHAUS_PACKET_COLOR"`
	SpamhausModelFileName string `yaml:"SPAMHAUS_MODEL_FILE_NAME"`
	SpamhausUpdateDuration int `yaml:"SPAMHAUS_UPDATE_DURATION"`

	// Blocklist.deの設定
	UseBlocklistDe bool `yaml:"USE_BLOCKLIST_DE"`
	BlocklistDeDataOutputPath string `yaml:"BLOCKLIST_DE_DATA_OUTPUT_PATH"`
	BlocklistDePacketColor struct {
		R int `yaml:"R"`
		G int `yaml:"G"`
		B int `yaml:"B"`
	} `yaml:"BLOCKLIST_DE_PACKET_COLOR"`
	BlocklistDeModelFileName string `yaml:"BLOCKLIST_DE_MODEL_FILE_NAME"`
	BlocklistDeUpdateDuration int `yaml:"BLOCKLIST_DE_UPDATE_DURATION"`

	// network周りの設定
	TargetDeviceName string `yaml:"TARGET_DEVICENAME"`
	CaptureDuration int `yaml:"CAPTURE_DURATION"`
	PacketLimitPerCaptureDuration int `yaml:"PACKET_LIMIT_PER_CAPTURE_DURATION"`
	VisibleCaptureMyself bool `yaml:"VISIBLE_CAPTURE_MYSELF"`
	BpfFilter string `yaml:"BPF_FILTER"`
	PromiscuousMode bool `yaml:"PROMISCUOUS_MODE"`

	// 見た目の設定
	EarthRadius float64 `yaml:"EARTH_RADIUS"`
	EarthRotate bool `yaml:"EARTH_ROTATE"`
	PacketGoal struct {
		Lat float64 `yaml:"lat"`
		Lng float64 `yaml:"lng"`
	} `yaml:"PACKET_GOAL"`
	PacketLimit int `yaml:"PACKET_LIMIT"`
	PacketOrbitHeight float64 `yaml:"PACKET_ORBIT_HEIGHT"`
	PacketGoalTime int `yaml:"PACKET_GOAL_TIME"`
	MaxPacketScale float64 `yaml:"MAX_PACKET_SCALE"`
	MaxScalePacketCount float64 `yaml:"MAX_SCALE_PACKET_COUNT"`
	DefaultPacketColor struct {
		R int `yaml:"R"`
		G int `yaml:"G"`
		B int `yaml:"B"`
	} `yaml:"DEFAULT_PACKET_COLOR"`
	DefaultPacketModelFileName string `yaml:"DEFAULT_PACKET_MODEL_FILE_NAME"`
	FlowCounterHeightRate float64 `yaml:"FLOW_COUNTER_HEIGHT_RATE"`
	FlowCounterMaxHeight int `yaml:"FLOW_COUNTER_MAX_HEIGHT"`
	DefaultFlowCounterColor struct {
		R int `yaml:"R"`
		G int `yaml:"G"`
		B int `yaml:"B"`
	} `yaml:"DEFAULT_FLOW_COUNTER_COLOR"`
	ClickedFlowCounterColor struct {
		R int `yaml:"R"`
		G int `yaml:"G"`
		B int `yaml:"B"`
	} `yaml:"CLICKED_FLOW_COUNTER_COLOR"`
}


func LoadAppConfig(filePath string) *app_configuration_model.AppConfiguration {
	content, err := os.ReadFile(filePath)
	if err != nil {
		log.Panicln("Error loading config file:", err)
	}

	appConfigInput := &appConfigurationField{}
	if err := yaml.Unmarshal(content, appConfigInput); err != nil {
		log.Panicln("Error loading config file:", err)
	}

	// validateする
	// validate := validator.New()
	// err = l.validate.Struct(appConfigInput)
	// if err != nil {
	// 	log.Fatalf("validation error: %v", err)
	// }

	serverIp, err := netip.ParseAddr(appConfigInput.ServerIP)
	if err != nil {
		log.Panicln("server ip parse error: %v", err)
	}

	appConfig := &app_configuration_model.AppConfiguration{
		Backend: app_configuration_components.BackendSetting{
			ServerIP: serverIp,
			ServerPort: appConfigInput.ServerPort,
			ServerClientContentPath: appConfigInput.ServerClientContentPath,
			ServerAutoOpenBrowser: appConfigInput.ServerAutoOpenBrowser,
		},
		Frontend: app_configuration_components.FrontendSetting{
			ApplicationReloadInterval: appConfigInput.ApplicationReloadInterval,
			WebsocketReconnectInterval: appConfigInput.WebsocketReconnectInterval,
		},
		Geoip: app_configuration_components.GeoipSetting{
			GeoipDbOutputPath: appConfigInput.GeoipDbOutputPath,
			GeoipDbPath: appConfigInput.GeoipDbPath,
		},
		Network: app_configuration_components.NetworkSetting{
			TargetDeviceName: appConfigInput.TargetDeviceName,
			CaptureDuration: appConfigInput.CaptureDuration,
			PacketLimitPerCaptureDuration: appConfigInput.PacketLimitPerCaptureDuration,
			VisibleCaptureMyself: appConfigInput.VisibleCaptureMyself,
			BpfFilter: appConfigInput.BpfFilter,
			PromiscuousMode: appConfigInput.PromiscuousMode,
		},
		ThreatDB: app_configuration_components.ThreatDBSetting{
			AbuseIP: app_configuration_components.AbuseIPSetting{
				ThreatDBSettingBase: app_configuration_components.ThreatDBSettingBase{
					UseDB: appConfigInput.UseAbuseIPDB,
					DataOutputPath: appConfigInput.AbuseIPDBBlacklistPath,
					DBUpdateDuration: appConfigInput.AbuseIPDBUpdateDuration,
				},
				APIKey: appConfigInput.AbuseIPDBAPIKey,
			},
			Spamhaus: app_configuration_components.SpamhausSetting{
				ThreatDBSettingBase: app_configuration_components.ThreatDBSettingBase{
					UseDB: appConfigInput.UseSpamhaus,
					DBUpdateDuration: appConfigInput.SpamhausUpdateDuration,
					DataOutputPath: appConfigInput.SpamhausDataOutputPath,
				},
			},
			BlocklistDe: app_configuration_components.BlocklistDeSetting{
				ThreatDBSettingBase: app_configuration_components.ThreatDBSettingBase{
					UseDB: appConfigInput.UseBlocklistDe,
					DBUpdateDuration: appConfigInput.BlocklistDeUpdateDuration,
					DataOutputPath: appConfigInput.BlocklistDeDataOutputPath,
				},
			},
		},
		Visualization: app_configuration_components.VisualizationSetting{
			EarthRadius: appConfigInput.EarthRadius,
			EarthRotate: appConfigInput.EarthRotate,
			PacketGoal: domain_model.Location{
				Latitude: appConfigInput.PacketGoal.Lat,
				Longitude: appConfigInput.PacketGoal.Lng,
			},
			PacketLimit: appConfigInput.PacketLimit,
			PacketOrbitHeight: appConfigInput.PacketOrbitHeight,
			PacketGoalTime: appConfigInput.PacketGoalTime,
			MaxPacketScale: appConfigInput.MaxPacketScale,
			MaxScalePacketCount: appConfigInput.MaxScalePacketCount,
			FlowCounterHeightRate: appConfigInput.FlowCounterHeightRate,
			FlowCounterMaxHeight: appConfigInput.FlowCounterMaxHeight,
			DefaultFlowCounterColor: domain_model.Color{
				Red: appConfigInput.DefaultFlowCounterColor.R,
				Green: appConfigInput.DefaultFlowCounterColor.G,
				Blue: appConfigInput.DefaultFlowCounterColor.B,
			},
			ClickedFlowCounterColor: domain_model.Color{
				Red: appConfigInput.ClickedFlowCounterColor.R,
				Green: appConfigInput.ClickedFlowCounterColor.G,
				Blue: appConfigInput.ClickedFlowCounterColor.B,
			},
			PacketVisualization: app_configuration_components.PacketVisualizationSetting{
				Default: app_configuration_components.DefaultPacketVisualizationSetting{
					PacketVisualizationSettingBase: app_configuration_components.PacketVisualizationSettingBase{
						PacketColor: domain_model.Color{
							Red: appConfigInput.DefaultPacketColor.R,
							Green: appConfigInput.DefaultPacketColor.G,
							Blue: appConfigInput.DefaultPacketColor.B,
						},
						ModelFileName: appConfigInput.DefaultPacketModelFileName,
					},
				},
				AbuseIP: app_configuration_components.AbuseIPPacketVisualizationSetting{
					PacketVisualizationSettingBase: app_configuration_components.PacketVisualizationSettingBase{
						PacketColor: domain_model.Color{
							Red: appConfigInput.AbuseIPDBPacketColor.R,
							Green: appConfigInput.AbuseIPDBPacketColor.G,
							Blue: appConfigInput.AbuseIPDBPacketColor.B,
						},
						ModelFileName: appConfigInput.AbuseIPDBModelFileName,
					},
					ThresholdConfidenceScore: appConfigInput.AbuseIPDBThresholdConfidenceScore,
				},
				Spamhaus: app_configuration_components.SpamhausPacketVisualizationSetting{
					PacketVisualizationSettingBase: app_configuration_components.PacketVisualizationSettingBase{
						PacketColor: domain_model.Color{
							Red: appConfigInput.SpamhausPacketColor.R,
							Green: appConfigInput.SpamhausPacketColor.G,
							Blue: appConfigInput.SpamhausPacketColor.B,
						},
						ModelFileName: appConfigInput.SpamhausModelFileName,
					},
				},
				BlocklistDe: app_configuration_components.BlacklistDePacketVisualizationSetting{
					PacketVisualizationSettingBase: app_configuration_components.PacketVisualizationSettingBase{
						PacketColor: domain_model.Color{
							Red: appConfigInput.BlocklistDePacketColor.R,
							Green: appConfigInput.BlocklistDePacketColor.G,
							Blue: appConfigInput.BlocklistDePacketColor.B,
						},
						ModelFileName: appConfigInput.BlocklistDeModelFileName,
					},
				},
			},
		},
	}

	log.Printf("Load config success")
	
	return appConfig
}

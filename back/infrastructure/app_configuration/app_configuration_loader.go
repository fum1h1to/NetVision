package app_configuration

import (
	"log"
	"os"

  "gopkg.in/yaml.v2"

	domain_model "NetVision/domain/model"
	app_configuration_model "NetVision/domain/model/app_configuration"
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
	AbuseIPDBPacketColor string `yaml:"ABUSE_IPDB_PACKET_COLOR"`
	AbuseIPDBModelFileName string `yaml:"ABUSE_IPDB_MODEL_FILE_NAME"`
	AbuseIPDBThresholdConfidenceScore int `yaml:"ABUSE_IPDB_THRESHOLD_CONFIDENCE_SCORE"`

	// Spamhausの設定
	UseSpamhaus bool `yaml:"USE_SPAMHAUS"`
	SpamhausDataOutputPath string `yaml:"SPAMHAUS_DATA_OUTPUT_PATH"`
	SpamhausPacketColor string `yaml:"SPAMHAUS_PACKET_COLOR"`
	SpamhausModelFileName string `yaml:"SPAMHAUS_MODEL_FILE_NAME"`
	SpamhausUpdateDuration int `yaml:"SPAMHAUS_UPDATE_DURATION"`

	// Blocklist.deの設定
	UseBlocklistDe bool `yaml:"USE_BLOCKLIST_DE"`
	BlocklistDeDataOutputPath string `yaml:"BLOCKLIST_DE_DATA_OUTPUT_PATH"`
	BlocklistDePacketColor string `yaml:"BLOCKLIST_DE_PACKET_COLOR"`
	BlocklistDeModelFileName string `yaml:"BLOCKLIST_DE_MODEL_FILE_NAME"`
	BlocklistDeUpdateDuration int `yaml:"BLOCKLIST_DE_UPDATE_DURATION"`

	// network周りの設定
	TargetDeviceName string `yaml:"TARGET_DEVICENAME"`
	CaptureDuration int `yaml:"CAPTURE_DURATION"`
	PacketLimitePerCaptureDuration int `yaml:"PACKET_LIMIT_PER_CAPTURE_DURATION"`
	VisibleCaptureMyself bool `yaml:"VISIBLE_CAPTURE_MYSELF"`
	BpfFilter string `yaml:"BPF_FILTER"`
	PromiscuousMode bool `yaml:"PROMISCUOUS_MODE"`

	// 見た目の設定
	EarthRadius int `yaml:"EARTH_RADIUS"`
	EarthRotate bool `yaml:"EARTH_ROTATE"`
	PacketGoal struct {
		Lat float64 `yaml:"lat"`
		Lng float64 `yaml:"lng"`
	} `yaml:"PACKET_GOAL"`
	PacketLimit int `yaml:"PACKET_LIMIT"`
	PacketOrbitHeight int `yaml:"PACKET_ORBIT_HEIGHT"`
	PacketGoalTime int `yaml:"PACKET_GOAL_TIME"`
	MaxPacketScale int `yaml:"MAX_PACKET_SCALE"`
	MaxScalePacketCount int `yaml:"MAX_SCALE_PACKET_COUNT"`
	DefaultPacketColor string `yaml:"DEFAULT_PACKET_COLOR"`
	DefaultPacketModelFileName string `yaml:"DEFAULT_PACKET_MODEL_FILE_NAME"`
	FlowCounterHeightRate float64 `yaml:"FLOW_COUNTER_HEIGHT_RATE"`
	FlowCounterMaxHeight int `yaml:"FLOW_COUNTER_MAX_HEIGHT"`
	DefaultFlowCounterColor string `yaml:"DEFAULT_FLOW_COUNTER_COLOR"`
	ClickedFlowCounterColor string `yaml:"CLICKED_FLOW_COUNTER_COLOR"`
}


func LoadAppConfig(filePath string) *app_configuration_model.AppConfiguration {
	content, err := os.ReadFile(filePath)
	if err != nil {
		log.Panicln("Error loading config file:", err)
	}

	appConfigInput = &appConfigurationField{}
	if err := yaml.Unmarshal(content, appConfigInput); err != nil {
		log.Panicln("Error loading config file:", err)
	}

	// validateする
	// validate := validator.New()
	// err = l.validate.Struct(appConfigInput)
	// if err != nil {
	// 	log.Fatalf("validation error: %v", err)
	// }

	appConfig = &app_configuration_model.AppConfiguration{
		Backend: app_configuration_model.BackendConfiguration{
			ServerIP: appConfigInput.ServerIP,
			ServerPort: appConfigInput.ServerPort,
			ServerClientContentPath: appConfigInput.ServerClientContentPath,
			ServerAutoOpenBrowser: appConfigInput.ServerAutoOpenBrowser,
		},
		Frontend: app_configuration_model.FrontendConfiguration{
			ApplicationReloadInterval: appConfigInput.ApplicationReloadInterval,
			WebsocketReconnectInterval: appConfigInput.WebsocketReconnectInterval,
		},
		GeoIP: app_configuration_model.GeoIPConfiguration{
			GeoipDbOutputPath: appConfigInput.GeoipDbOutputPath,
			GeoipDbPath: appConfigInput.GeoipDbPath,
		},
		Network: app_configuration_model.NetworkConfiguration{
			TargetDeviceName: appConfigInput.TargetDeviceName,
			CaptureDuration: appConfigInput.CaptureDuration,
			PacketLimitePerCaptureDuration: appConfigInput.PacketLimitePerCaptureDuration,
			VisibleCaptureMyself: appConfigInput.VisibleCaptureMyself,
			BpfFilter: appConfigInput.BpfFilter,
			PromiscuousMode: appConfigInput.PromiscuousMode,
		},
		ThreatDB: app_configuration_model.ThreatDBConfiguration{
			AbuseIP: app_configuration_model.AbuseIPConfiguration{
				UseDB: appConfigInput.UseAbuseIPDB,
				DBUpdateDuration: appConfigInput.AbuseIPDBUpdateDuration,
				DataOutputPath: appConfigInput.AbuseIPDBBlacklistPath,
				APIKey: appConfigInput.AbuseIPDBAPIKey,
				ThresholdConfidenceScore: appConfigInput.AbuseIPDBThresholdConfidenceScore,
			},
			Spamhaus: app_configuration_model.SpamhausConfiguration{
				UseDB: appConfigInput.UseSpamhaus,
				DBUpdateDuration: appConfigInput.SpamhausUpdateDuration,
				DataOutputPath: appConfigInput.SpamhausDataOutputPath,
			},
			BlocklistDe: app_configuration_model.BlocklistDeConfiguration{
				UseDB: appConfigInput.UseBlocklistDe,
				DBUpdateDuration: appConfigInput.BlocklistDeUpdateDuration,
				DataOutputPath: appConfigInput.BlocklistDeDataOutputPath,
			},
		},
		Visualization: app_configuration_model.VisualizationConfiguration{
			EarthRadius: appConfigInput.EarthRadius,
			EarthRotate: appConfigInput.EarthRotate,
			PacketGoal: domain_model.Location{
				Lat: appConfigInput.PacketGoal.Lat,
				Lng: appConfigInput.PacketGoal.Lng,
			},
			PacketLimit: appConfigInput.PacketLimit,
			PacketOrbitHeight: appConfigInput.PacketOrbitHeight,
			PacketGoalTime: appConfigInput.PacketGoalTime,
			MaxPacketScale: appConfigInput.MaxPacketScale,
			MaxScalePacketCount: appConfigInput.MaxScalePacketCount,
			FlowCounterHeightRate: appConfigInput.FlowCounterHeightRate,
			FlowCounterMaxHeight: appConfigInput.FlowCounterMaxHeight,
			DefaultFlowCounterColor: appConfigInput.DefaultFlowCounterColor,
			ClickedFlowCounterColor: appConfigInput.ClickedFlowCounterColor,
			PacketVisualization: app_configuration_model.PacketVisualizationConfiguration{
				Default: app_configuration_model.DefaultPacketVisualizationConfiguration{
					PacketColor: appConfigInput.DefaultPacketColor,
					ModelFileName: appConfigInput.DefaultPacketModelFileName,
				},
				AbuseIP: app_configuration_model.AbuseIPPacketVisualizationConfiguration{
					PacketColor: appConfigInput.AbuseIPDBPacketColor,
					ModelFileName: appConfigInput.AbuseIPDBModelFileName,
				},
				Spamhaus: app_configuration_model.SpamhausPacketVisualizationConfiguration{
					PacketColor: appConfigInput.SpamhausPacketColor,
					ModelFileName: appConfigInput.SpamhausModelFileName,
				},
				BlocklistDe: app_configuration_model.BlocklistDePacketVisualizationConfiguration{
					PacketColor: appConfigInput.BlocklistDePacketColor,
					ModelFileName: appConfigInput.BlocklistDeModelFileName,
				},
			},
		},
	}

	log.Printf("Load config success")
	
	return appConfig
}

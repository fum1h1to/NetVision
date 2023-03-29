package configs

import (
	"log"
	"os"

  "gopkg.in/yaml.v2"
)

var data *Config = LoadConfig("./config.yaml")

type Config struct {
	ServerIP string `yaml:"SERVER_IP"`
	ServerPort int `yaml:"SERVER_PORT"`
	ServerClientContentPath string `yaml:"SERVER_CLIENT_CONTENT_PATH"`

	ApplicationReloadInterval int `yaml:"APPLICATION_RELOAD_INTERVAL"`
	MaxFps int `yaml:"MAX_FPS"`
	WebsocketReconnectInterval int `yaml:"WEBSOCKET_RECONNECT_INTERVAL"`

	GeoipDbPath string `yaml:"GEOIP_DB_PATH"`

	AbuseIPDBUpdateDuration int `yaml:"ABUSE_IPDB_UPDATE_DURATION"`
	AbuseIPDBAPIKey string `yaml:"ABUSE_IPDB_API_KEY"`
	AbuseIPDBBlacklistPath string `yaml:"ABUSE_IPDB_BLACKLIST_PATH"`
	AbuseIPDBPacketColor string `yaml:"ABUSE_IPDB_PACKET_COLOR"`
	AbuseIPDBThresholdConfidenceScore int `yaml:"ABUSE_IPDB_THRESHOLD_CONFIDENCE_SCORE"`

	TargetDeviceName string `yaml:"TARGET_DEVICENAME"`
	CaptureDuration int `yaml:"CAPTURE_DURATION"`
	PacketLimitePerCaptureDuration int `yaml:"PACKET_LIMIT_PER_CAPTURE_DURATION"`
	VisibleCaptureMyself bool `yaml:"VISIBLE_CAPTURE_MYSELF"`
	BpfFilter string `yaml:"BPF_FILTER"`
	PromiscuousMode bool `yaml:"PROMISCUOUS_MODE"`

	EarthRadius int `yaml:"EARTH_RADIUS"`
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
	FlowCounterHeightRate float64 `yaml:"FLOW_COUNTER_HEIGHT_RATE"`
	FlowCounterMaxHeight int `yaml:"FLOW_COUNTER_MAX_HEIGHT"`
	DefaultFlowCounterColor string `yaml:"DEFAULT_FLOW_COUNTER_COLOR"`
	ClickedFlowCounterColor string `yaml:"CLICKED_FLOW_COUNTER_COLOR"`
}

func LoadConfig(filePath string) (config *Config) {
	content, err := os.ReadFile(filePath)
	if err != nil {
		log.Panicln("Error loading config file:", err)
	}

	config = &Config{}
	if err := yaml.Unmarshal(content, config); err != nil {
		log.Panicln("Error loading config file:", err)
	}

	log.Printf("Load config success")
	
	return
}


func GetServerIP() string {
	return data.ServerIP
}
func GetServerPort() int {
	return data.ServerPort
}
func GetServerClientContentPath() string {
	return data.ServerClientContentPath
}

func GetApplicationReloadInterval() int {
	return data.ApplicationReloadInterval
}
func GetMaxFps() int {
	return data.MaxFps
}
func GetWebsocketReconnectInterval() int {
	return data.WebsocketReconnectInterval
}

func GetGeoipDbPath() string {
	return data.GeoipDbPath
}

func GetAbuseIPDBAPIKey() string {
	return data.AbuseIPDBAPIKey
}
func GetAbuseIPDBUpdateDuration() int {
	return data.AbuseIPDBUpdateDuration
}
func GetAbuseIPDBBlacklistPath() string {
	return data.AbuseIPDBBlacklistPath
}
func GetAbuseIPDBPacketColor() string {
	return data.AbuseIPDBPacketColor
}
func GetAbuseIPDBThresholdConfidenceScore() int {
	return data.AbuseIPDBThresholdConfidenceScore
}

func GetTargetDeviceName() string {
	return data.TargetDeviceName
}
func GetCaptureDuration() int {
	return data.CaptureDuration
}
func GetPacketLimitPerCaptureDuration() int {
	return data.PacketLimitePerCaptureDuration
}
func GetVisibleCaptureMyself() bool {
	return data.VisibleCaptureMyself
}
func GetBpfFilter() string {
	return data.BpfFilter
}
func GetPromiscuousMode() bool {
	return data.PromiscuousMode
}

func GetEarthRadius() int {
	return data.EarthRadius
}
func GetPacketGoalLat() float64 {
	return data.PacketGoal.Lat
}
func GetPacketGoalLng() float64 {
	return data.PacketGoal.Lng
}
func GetPacketLimit() int {
	return data.PacketLimit
}
func GetPacketOrbitHeight() int {
	return data.PacketOrbitHeight
}
func GetPacketGoalTime() int {
	return data.PacketGoalTime
}
func GetMaxPacketScale() int {
	return data.MaxPacketScale
}
func GetMaxScalePacketCount() int {
	return data.MaxScalePacketCount
}
func GetDefaultPacketColor() string {
	return data.DefaultPacketColor
}
func GetFlowCounterHeightRate() float64 {
	return data.FlowCounterHeightRate
}
func GetFlowCounterMaxHeight() int {
	return data.FlowCounterMaxHeight
}
func GetDefaultFlowCounterColor() string {
	return data.DefaultFlowCounterColor
}
func GetClickedFlowCounterColor() string {
	return data.ClickedFlowCounterColor
}
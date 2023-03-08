package configs

import (
	"log"
	"os"

  "gopkg.in/yaml.v2"
)

var data *Config = LoadConfig("./config.yaml")

type Config struct {
	TargetDeviceName string `yaml:"TARGET_DEVICENAME"`
	CaptureDuration int `yaml:"CAPTURE_DURATION"`
	PacketLimitePerCaptureDuration int `yaml:"PACKET_LIMIT_PER_CAPTURE_DURATION"`
	VisibleCaptureMyself bool `yaml:"VISIBLE_CAPTURE_MYSELF"`
	BpfFilter string `yaml:"BPF_FILTER"`
	GeoipDbPath string `yaml:"GEOIP_DB_PATH"`
	ServerPort int `yaml:"SERVER_PORT"`
	ServerClientContentPath string `yaml:"SERVER_CLIENT_CONTENT_PATH"`
	AbuseIPDBAPIKey string `yaml:"ABUSE_IPDB_API_KEY"`
	AbuseIPDBBlacklistPath string `yaml:"ABUSE_IPDB_BLACKLIST_PATH"`
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

	log.Printf("Loaded config")
	
	return
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

func GetGeoipDbPath() string {
	return data.GeoipDbPath
}

func GetServerPort() int {
	return data.ServerPort
}

func GetServerClientContentPath() string {
	return data.ServerClientContentPath
}

func GetAbuseIPDBBlacklistPath() string {
	return data.AbuseIPDBBlacklistPath
}

func GetAbuseIPDBAPIKey() string {
	return data.AbuseIPDBAPIKey
}
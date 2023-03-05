package configs

import (
	"log"
	"io/ioutil"

  "gopkg.in/yaml.v2"
)

var data *Config = LoadConfig("./config.yaml")

type Config struct {
	TargetDeviceName string `yaml:"TARGET_DEVICENAME"`
	CaptureDuration int `yaml:"CAPTURE_DURATION"`
	PacketLimitePerCaptureDuration int `yaml:"PACKET_LIMIT_PER_CAPTURE_DURATION"`
	BpfFilter string `yaml:"BPF_FILTER"`
	GeoipDbPath string `yaml:"GEOIP_DB_PATH"`
	ServerPort int `yaml:"SERVER_PORT"`
}

func LoadConfig(filePath string) (config *Config) {
	content, err := ioutil.ReadFile(filePath)
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

func GetBpfFilter() string {
	return data.BpfFilter
}

func GetGeoipDbPath() string {
	return data.GeoipDbPath
}

func GetServerPort() int {
	return data.ServerPort
}
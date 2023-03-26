package server

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"NetVision/configs"
	"NetVision/web/domain"
	"NetVision/web/handlers"
)

type WebServer struct {
	Hub *domain.Hub
}

func CreateServer() *WebServer {
	hub := domain.NewHub()
	return &WebServer{
		Hub: hub,
	}
}

func (w *WebServer) StartServer() {
	go w.Hub.RunLoop()

	w.createServerData()
	w.createClientSettingData()
	http.HandleFunc("/", http.FileServer(http.Dir(configs.GetServerClientContentPath())).ServeHTTP)
	http.HandleFunc("/ws", handlers.NewWebsocketHandler(w.Hub).Handle)

	port := configs.GetServerPort()
	log.Printf("Listening on port %d", port)

	if err := http.ListenAndServe(fmt.Sprintf(":%v", port), nil); err != nil {
		log.Panicln("Server Error:", err)
	}
}

type serverData struct {
	Server struct {
		Port          int    `json:"port"`
		Host          string `json:"host"`
		WebsocketPath string `json:"websocket_path"`
	} `json:"server"`
}

func (w *WebServer) createServerData() {
	serverData := new(serverData)
	serverData.Server.Port = configs.GetServerPort()
	serverData.Server.Host = configs.GetServerIP()
	serverData.Server.WebsocketPath = "ws"

	jsonData, err := json.Marshal(serverData)
	if err != nil {
		log.Panicln("Error: ", err)
		return
	}
	err = os.WriteFile(configs.GetServerClientContentPath() + "/data/server.json", jsonData, 0644)
	if err != nil {
		log.Panicln("Error: ", err)
		return
	}
}

type clientSettingData struct {
	ApplicationReloadInterval  int `json:"APPLICATION_RELOAD_INTERVAL"`
	MaxFps                     int `json:"MAX_FPS"`
	EarthRadius                int `json:"EARTH_RADIUS"`
	WebsocketReconnectInterval int `json:"WEBSOCKET_RECONNECT_INTERVAL"`
	GetPacketLimit             int `json:"GET_PACKET_LIMIT"`
	PacketGoal                 struct {
		Lat float64 `json:"lat"`
		Lng float64 `json:"lng"`
	} `json:"PACKET_GOAL"`
	PacketOrbitHeight                 int     `json:"PACKET_ORBIT_HEIGHT"`
	PacketGoalTime                    int     `json:"PACKET_GOAL_TIME"`
	MaxPacketScale                    int     `json:"MAX_PACKET_SCALE"`
	MaxScalePacketCount               int     `json:"MAX_SCALE_PACKET_COUNT"`
	DefaultPacketColor                string  `json:"DEFAULT_PACKET_COLOR"`
	FlowCounterHeightRate             float64 `json:"FLOW_COUNTER_HEIGHT_RATE"`
	FlowCounterMaxHeight              int     `json:"FLOW_COUNTER_MAX_HEIGHT"`
	DefaultFlowCounterColor           string  `json:"DEFAULT_FLOW_COUNTER_COLOR"`
	ClickedFlowCounterColor           string  `json:"CLICKED_FLOW_COUNTER_COLOR"`
	AbuseipdbIPColor                  string  `json:"ABUSEIPDB_IP_COLOR"`
	ThresholdAbuseipdbConfidenceScore int     `json:"THRESHOLD_ABUSEIPDB_CONFIDENCE_SCORE"`
}

func (w *WebServer) createClientSettingData() {
	clientSettingData := new(clientSettingData)

	clientSettingData.ApplicationReloadInterval = 24 // configs.GetApplicationReloadInterval()
	clientSettingData.MaxFps = 60 // configs.GetMaxFps()
	clientSettingData.EarthRadius = 8 // configs.GetEarthRadius()
	clientSettingData.WebsocketReconnectInterval = 10000 // configs.GetWebsocketReconnectInterval()
	clientSettingData.GetPacketLimit = 300 // configs.GetGetPacketLimit()
	clientSettingData.PacketGoal.Lat = 35 // configs.GetPacketGoalLat()
	clientSettingData.PacketGoal.Lng = 140 // configs.GetPacketGoalLng()
	clientSettingData.PacketOrbitHeight = 3 // configs.GetPacketOrbitHeight()
	clientSettingData.PacketGoalTime = 5 // configs.GetPacketGoalTime()
	clientSettingData.MaxPacketScale = 5 // configs.GetMaxPacketScale()
	clientSettingData.MaxScalePacketCount = 100 // configs.GetMaxScalePacketCount()
	clientSettingData.DefaultPacketColor = "0xffff00" // configs.GetDefaultPacketColor()
	clientSettingData.FlowCounterHeightRate = 0.01 // configs.GetFlowCounterHeightRate()
	clientSettingData.FlowCounterMaxHeight = 5 // configs.GetFlowCounterMaxHeight()
	clientSettingData.DefaultFlowCounterColor = "0x0000ff" // configs.GetDefaultFlowCounterColor()
	clientSettingData.ClickedFlowCounterColor = "0x00ff00" // configs.GetClickedFlowCounterColor()
	clientSettingData.AbuseipdbIPColor = "0xff0000" // configs.GetAbuseipdbIPColor()
	clientSettingData.ThresholdAbuseipdbConfidenceScore = 50 // configs.GetThresholdAbuseipdbConfidenceScore()
	
	jsonData, err := json.Marshal(clientSettingData)
	if err != nil {
		log.Panicln("Error: ", err)
		return
	}
	err = os.WriteFile(configs.GetServerClientContentPath() + "/data/setting.json", jsonData, 0644)
	if err != nil {
		log.Panicln("Error: ", err)
		return
	}
}
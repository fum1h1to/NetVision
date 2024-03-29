package server

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/skratchdot/open-golang/open"

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

	if configs.GetServerAutoOpenBrowser() {
		err := open.Run(fmt.Sprintf("http://%s:%d/", configs.GetServerIP(), port))
		if err != nil {
			log.Printf("Error: failed to open browser.\nplease open browser manually -> http://%s:%d/", configs.GetServerIP(), port)
		} else {
			log.Println("browser start")
		}
	}

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
	EarthRadius                int `json:"EARTH_RADIUS"`
	EarthRotate                bool `json:"EARTH_ROTATE"`
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
	DefaultPacketModelFileName				string  `json:"DEFAULT_PACKET_MODEL_FILE_NAME"`
	FlowCounterHeightRate             float64 `json:"FLOW_COUNTER_HEIGHT_RATE"`
	FlowCounterMaxHeight              int     `json:"FLOW_COUNTER_MAX_HEIGHT"`
	DefaultFlowCounterColor           string  `json:"DEFAULT_FLOW_COUNTER_COLOR"`
	ClickedFlowCounterColor           string  `json:"CLICKED_FLOW_COUNTER_COLOR"`
	IsAbuseipdbUse										bool    `json:"IS_ABUSEIPDB_USE"`
	AbuseipdbIPColor                  string  `json:"ABUSEIPDB_IP_COLOR"`
	AbuseipdbIPModelFileName					string  `json:"ABUSEIPDB_IP_MODEL_FILE_NAME"`
	IsSpamhausUse											bool    `json:"IS_SPAMHAUS_USE"`
	SpamhausIPColor									 	string  `json:"SPAMHAUS_IP_COLOR"`
	SpamhausIPModelFileName						string  `json:"SPAMHAUS_IP_MODEL_FILE_NAME"`
	IsBlocklistDeUse									bool    `json:"IS_BLOCKLIST_DE_USE"`
	BlocklistDeIPColor								string  `json:"BLOCKLIST_DE_IP_COLOR"`
	BlocklistDeIPModelFileName 				string  `json:"BLOCKLIST_DE_IP_MODEL_FILE_NAME"`
	ThresholdAbuseipdbConfidenceScore int     `json:"THRESHOLD_ABUSEIPDB_CONFIDENCE_SCORE"`
}

func (w *WebServer) createClientSettingData() {
	clientSettingData := new(clientSettingData)

	clientSettingData.ApplicationReloadInterval = configs.GetApplicationReloadInterval()
	clientSettingData.EarthRadius = configs.GetEarthRadius()
	clientSettingData.EarthRotate = configs.GetEarthRotate()
	clientSettingData.WebsocketReconnectInterval = configs.GetWebsocketReconnectInterval()
	clientSettingData.GetPacketLimit = configs.GetPacketLimit()
	clientSettingData.PacketGoal.Lat = configs.GetPacketGoalLat()
	clientSettingData.PacketGoal.Lng = configs.GetPacketGoalLng()
	clientSettingData.PacketOrbitHeight = configs.GetPacketOrbitHeight()
	clientSettingData.PacketGoalTime = configs.GetPacketGoalTime()
	clientSettingData.MaxPacketScale = configs.GetMaxPacketScale()
	clientSettingData.MaxScalePacketCount = configs.GetMaxScalePacketCount()
	clientSettingData.DefaultPacketColor = configs.GetDefaultPacketColor()
	clientSettingData.DefaultPacketModelFileName = configs.GetDefaultPacketModelFileName()
	clientSettingData.FlowCounterHeightRate = configs.GetFlowCounterHeightRate()
	clientSettingData.FlowCounterMaxHeight = configs.GetFlowCounterMaxHeight()
	clientSettingData.DefaultFlowCounterColor = configs.GetDefaultFlowCounterColor()
	clientSettingData.ClickedFlowCounterColor = configs.GetClickedFlowCounterColor()
	if configs.GetUseAbuseIPDB() {
		clientSettingData.IsAbuseipdbUse = true
	} else {
		clientSettingData.IsAbuseipdbUse = false
	}
	clientSettingData.AbuseipdbIPColor = configs.GetAbuseIPDBPacketColor()
	clientSettingData.AbuseipdbIPModelFileName = configs.GetAbuseIPDBModelFileName()
	if configs.GetUseSpamhaus() {
		clientSettingData.IsSpamhausUse = true
	} else {
		clientSettingData.IsSpamhausUse = false
	}
	clientSettingData.SpamhausIPColor = configs.GetSpamhausPacketColor()
	clientSettingData.SpamhausIPModelFileName = configs.GetSpamhausModelFileName()
	if configs.GetUseBlocklistDe() {
		clientSettingData.IsBlocklistDeUse = true
	} else {
		clientSettingData.IsBlocklistDeUse = false
	}
	clientSettingData.BlocklistDeIPColor = configs.GetBlocklistDePacketColor()
	clientSettingData.BlocklistDeIPModelFileName = configs.GetBlocklistDeModelFileName()
	clientSettingData.ThresholdAbuseipdbConfidenceScore = configs.GetAbuseIPDBThresholdConfidenceScore()
	
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
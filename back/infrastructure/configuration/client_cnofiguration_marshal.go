package configuration

import (
	"encoding/json"

	"NetVision/domain/model/configuration"
)

type ClientConfigurationMarshal struct {
	appConfig *configuration.AppConfiguration
}

func NewClientConfigurationMarshal(
	appConfig *configuration.AppConfiguration,
) *ClientConfigurationMarshal {
	return &ClientConfigurationMarshal{
		appConfig: appConfig,
	}
}

type clientConfigurationField struct {
	ApplicationReloadInterval  int `json:"APPLICATION_RELOAD_INTERVAL"`
	EarthRadius                float64 `json:"EARTH_RADIUS"`
	EarthRotate                bool `json:"EARTH_ROTATE"`
	WebsocketReconnectInterval int `json:"WEBSOCKET_RECONNECT_INTERVAL"`
	GetPacketLimit             int `json:"GET_PACKET_LIMIT"`
	PacketGoal                 struct {
		Lat float64 `json:"lat"`
		Lng float64 `json:"lng"`
	} `json:"PACKET_GOAL"`
	PacketOrbitHeight                 float64 `json:"PACKET_ORBIT_HEIGHT"`
	PacketGoalTime                    int     `json:"PACKET_GOAL_TIME"`
	MaxPacketScale                    float64 `json:"MAX_PACKET_SCALE"`
	MaxScalePacketCount               float64 `json:"MAX_SCALE_PACKET_COUNT"`
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

func (c *ClientConfigurationMarshal) Marshal() (marshal_string []byte, err error) {
	clientConfig := new(clientConfigurationField)

	// frontend
	clientConfig.ApplicationReloadInterval = c.appConfig.Frontend.ApplicationReloadInterval
	clientConfig.WebsocketReconnectInterval = c.appConfig.Frontend.WebsocketReconnectInterval

	// visualization
	clientConfig.EarthRadius = c.appConfig.Visualization.EarthRadius
	clientConfig.EarthRotate = c.appConfig.Visualization.EarthRotate
	clientConfig.GetPacketLimit = c.appConfig.Visualization.PacketLimit
	clientConfig.PacketGoal.Lat = c.appConfig.Visualization.PacketGoal.Latitude
	clientConfig.PacketGoal.Lng = c.appConfig.Visualization.PacketGoal.Longitude
	clientConfig.PacketOrbitHeight = c.appConfig.Visualization.PacketOrbitHeight
	clientConfig.PacketGoalTime = c.appConfig.Visualization.PacketGoalTime
	clientConfig.MaxPacketScale = c.appConfig.Visualization.MaxPacketScale
	clientConfig.MaxScalePacketCount = c.appConfig.Visualization.MaxScalePacketCount
	clientConfig.FlowCounterHeightRate = c.appConfig.Visualization.FlowCounterHeightRate
	clientConfig.FlowCounterMaxHeight = c.appConfig.Visualization.FlowCounterMaxHeight
	clientConfig.DefaultFlowCounterColor = c.appConfig.Visualization.DefaultFlowCounterColor.ToHexString()
	clientConfig.ClickedFlowCounterColor = c.appConfig.Visualization.ClickedFlowCounterColor.ToHexString()
	
	// packet visualiation
	// default
	clientConfig.DefaultPacketColor = c.appConfig.Visualization.PacketVisualization.Default.PacketColor.ToHexString()
	clientConfig.DefaultPacketModelFileName = c.appConfig.Visualization.PacketVisualization.Default.ModelFileName

	// abuseipdb
	if (c.appConfig.ThreatDB.AbuseIP.UseDB) {
		clientConfig.IsAbuseipdbUse = true
	} else {
		clientConfig.IsAbuseipdbUse = false
	}
	clientConfig.AbuseipdbIPColor = c.appConfig.Visualization.PacketVisualization.AbuseIP.PacketColor.ToHexString()
	clientConfig.AbuseipdbIPModelFileName = c.appConfig.Visualization.PacketVisualization.AbuseIP.ModelFileName
	clientConfig.ThresholdAbuseipdbConfidenceScore = c.appConfig.Visualization.PacketVisualization.AbuseIP.ThresholdConfidenceScore

	// spamhaus
	if (c.appConfig.ThreatDB.Spamhaus.UseDB) {
		clientConfig.IsSpamhausUse = true
	} else {
		clientConfig.IsSpamhausUse = false
	}
	clientConfig.SpamhausIPColor = c.appConfig.Visualization.PacketVisualization.Spamhaus.PacketColor.ToHexString()
	clientConfig.SpamhausIPModelFileName = c.appConfig.Visualization.PacketVisualization.Spamhaus.ModelFileName

	// blocklist.de
	if (c.appConfig.ThreatDB.BlocklistDe.UseDB) {
		clientConfig.IsBlocklistDeUse = true
	} else {
		clientConfig.IsBlocklistDeUse = false
	}
	clientConfig.BlocklistDeIPColor = c.appConfig.Visualization.PacketVisualization.BlocklistDe.PacketColor.ToHexString()
	clientConfig.BlocklistDeIPModelFileName = c.appConfig.Visualization.PacketVisualization.BlocklistDe.ModelFileName


	marshal_string, err = json.Marshal(clientConfig)

	return
}


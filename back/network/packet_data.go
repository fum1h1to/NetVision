package network

type PacketData struct {
	From struct {
		Lat float64	`json:"lat"`
		Lng float64 `json:"lng"`
	} `json:"from"`
	Srcip string `json:"srcip"`
	Srcport string `json:"srcport"`
	ProtocolType string `json:"protocolType"`
	AbuseIPScore int `json:"abuseIPScore"`
	PacketCount int `json:"packetCount"`
	IsSpamhausContain bool `json:"isSpamhausContain"`
	IsBlocklistDeContain bool `json:"isBlocklistDeContain"`
}

func IsValidPacketData(packetData *PacketData) bool {
	if packetData.Srcip == "" {
		return false
	}
	if packetData.From.Lat == 0 && packetData.From.Lng == 0 {
		return false
	}

	return true
}
package model

import (
	"net/netip"
)

type PacketData struct {
	From domain.Location
	Srcip netip.Addr
	Srcport int
	ProtocolType string
	AbuseIPScore int
	PacketCount int
	IsSpamhausContain bool
	IsBlocklistDeContain bool
}

// func IsValidPacketData(packetData *PacketData) bool {
// 	if packetData.Srcip == "" {
// 		return false
// 	}
// 	if packetData.From.Latitude == 0 && packetData.From.Longitude == 0 {
// 		return false
// 	}

// 	return true
// }
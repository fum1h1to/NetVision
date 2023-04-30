package network

import (
	"log"

	"NetVision/util/ip2LatLng"
	"NetVision/util/checkAbuseIP"
	"NetVision/util/global"
  "github.com/google/gopacket"
)

type PacketAnalyser struct {
	Ip2LatLngExchanger *ip2LatLng.Ip2LatLngExchanger
	AbuseIPChecker *checkAbuseIP.AbuseIPChecker
}

func CreatePacketAnalyser() *PacketAnalyser {
	ip2LatLngExchanger := ip2LatLng.CreateIp2LatLngExchanger()
	AbuseIPChecker := checkAbuseIP.CreateAbuseIPChecker()

	return &PacketAnalyser{
		Ip2LatLngExchanger: ip2LatLngExchanger,
		AbuseIPChecker: AbuseIPChecker,
	}
}

func (p *PacketAnalyser) AnalysisPacket(packet gopacket.Packet) (packetData *PacketData){
	packetData = new(PacketData)

	if packet.NetworkLayer() != nil {
		srcip := packet.NetworkLayer().NetworkFlow().Src().String()
		packetData.Srcip = srcip
		
		lat, lng, err := p.Ip2LatLngExchanger.GetLatLng(srcip)
		if err != nil {
			log.Printf("Error: %s", err)
		}
		packetData.From.Lat = lat
		packetData.From.Lng = lng

		if global.GetUseAbuseIPDB() {
			packetData.AbuseIPScore = p.AbuseIPChecker.GetAbuseIPScore(srcip)
		} else {
			packetData.AbuseIPScore = 0
		}
	}

	if packet.TransportLayer() != nil {
		packetData.Srcport = packet.TransportLayer().TransportFlow().Src().String()
	}

	if packet.TransportLayer() != nil {
		packetData.ProtocolType = packet.TransportLayer().LayerType().String()
	}

	return
}

func (p *PacketAnalyser) UpdateAbuseIPChecker() {
	p.AbuseIPChecker.UpdateBlackList()
}
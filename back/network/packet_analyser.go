package network

import (
	"DarkVision/util/ip2LatLng"
	"DarkVision/util/checkAbuseIP"
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

func (p *PacketAnalyser) AnalysisPacket(packet gopacket.Packet) (exchangeData *ExchangeStruct){
	exchangeData = new(ExchangeStruct)

	if packet.NetworkLayer() != nil {
		srcip := packet.NetworkLayer().NetworkFlow().Src().String()
		exchangeData.Srcip = srcip
		
		lat, lng := p.Ip2LatLngExchanger.GetLatLng(srcip)
		exchangeData.From.Lat = lat
		exchangeData.From.Lng = lng
	}

	if packet.TransportLayer() != nil {
		exchangeData.Srcport = packet.TransportLayer().TransportFlow().Src().String()
	}

	if packet.TransportLayer() != nil {
		exchangeData.ProtocolType = packet.TransportLayer().LayerType().String()
	}

	return
}
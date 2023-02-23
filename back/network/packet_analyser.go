package network

import (
	"DarkVision/util/ip2LatLng"
    "github.com/google/gopacket"
)

type packetAnalyser struct {
	Ip2LatLngExchanger *ip2LatLng.Ip2LatLngExchanger
}

func CreatePacketAnalyser() *packetAnalyser {
	ip2LatLngExchanger := ip2LatLng.CreateIp2LatLngExchanger()

	return &packetAnalyser{
		Ip2LatLngExchanger: ip2LatLngExchanger,
	}
}

func (p *packetAnalyser) analysisPacket(packet gopacket.Packet) (exchangeData *ExchangeStruct){
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
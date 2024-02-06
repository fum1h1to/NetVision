package network

import (

)

type PacketBundler struct {
	packetDatas []*PacketData
	packetBundleMap map[string][]*PacketData
}

func CreatePacketBundler(packetDatas []*PacketData) *PacketBundler {
	return &PacketBundler{
		packetDatas: packetDatas,
		packetBundleMap: make(map[string][]*PacketData),
	}
}

func (pb *PacketBundler) Bundle() (outputPacketDatas []*PacketData) {
	for _, packetData := range pb.packetDatas {
		pb.packetBundleMap[packetData.Srcip] = append(pb.packetBundleMap[packetData.Srcip], packetData)
	}

	for _, packets := range pb.packetBundleMap {
		packets[0].PacketCount = len(packets)
		packetBundle := packets[0]
		outputPacketDatas = append(outputPacketDatas, packetBundle)
	}

	return
}
package network

import (
	"log"
	"time"

	"DarkVision/configs"
	"github.com/google/gopacket"
	"github.com/google/gopacket/pcap"
)

func StartCapturing(dataOutput chan<- []*PacketData) {
	log.Println("Capture Start")
	
	handle, err := pcap.OpenLive(configs.GetTargetDeviceName(), 1024, false, time.Duration(configs.GetCaptureDuration()) * time.Millisecond)
	if err != nil {
			log.Fatal(err)
	}
	defer handle.Close()

	err = handle.SetBPFFilter(configs.GetBpfFilter())
	if err != nil {
			log.Fatal(err)
	}

	packetSource := gopacket.NewPacketSource(handle, handle.LinkType())
	packetCount := 0
	validPacketCount := 0
	packetDatas := make([]*PacketData, configs.GetPacketLimitPerCaptureDuration())
	packetAnalyser := CreatePacketAnalyser()

	ticker := time.NewTicker(time.Duration(configs.GetCaptureDuration()) * time.Millisecond)
	defer func() {
		ticker.Stop()
	}()

	for {
		select {
		case packet := <- packetSource.Packets():
			if packetCount < configs.GetPacketLimitPerCaptureDuration() {
				data := packetAnalyser.AnalysisPacket(packet)
				if IsValidPacketData(data) {
					packetDatas[validPacketCount] = data
					validPacketCount++
				}
				packetCount++
			}
		case <-ticker.C:
			if validPacketCount != 0 {
				dataOutput <- packetDatas[:validPacketCount]
				validPacketCount = 0
			} 
			packetCount = 0
		}
	}
}

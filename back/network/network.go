package network

import (
    "log"
    "time"

	"DarkVision/configs"
    "github.com/google/gopacket"
    "github.com/google/gopacket/pcap"
)

func StartCapturing(dataOutput chan<- []*ExchangeStruct) {
	log.Println("Capture Start")
	
    handle, err := pcap.OpenLive(configs.TARGET_DEVICENAME, 1024, false, configs.CAPTURE_DURATION*time.Millisecond)
    if err != nil {
        log.Fatal(err)
    }
    defer handle.Close()

    err = handle.SetBPFFilter(configs.BPF_FILTER)
    if err != nil {
        log.Fatal(err)
    }

    packetSource := gopacket.NewPacketSource(handle, handle.LinkType())
	packetCount := 0
	validPacketCount := 0
	packetDatas := make([]*ExchangeStruct, configs.PACKET_LIMIT_PER_CAPTURE_DURATION)
	packetAnalyser := CreatePacketAnalyser()

	ticker := time.NewTicker(configs.CAPTURE_DURATION * time.Millisecond)
	defer func() {
		ticker.Stop()
	}()

	for {
		select {
		case packet := <- packetSource.Packets():
			if packetCount < configs.PACKET_LIMIT_PER_CAPTURE_DURATION {
				data := packetAnalyser.AnalysisPacket(packet)
				if IsValidExchangeStruct(data) {
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

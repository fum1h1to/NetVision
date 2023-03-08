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

	bpfFilter := createBpfFilter()

	err = handle.SetBPFFilter(bpfFilter)
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
				packetBundler := CreatePacketBundler(packetDatas[:validPacketCount])
				dataOutput <- packetBundler.Bundle()
				validPacketCount = 0
			} 
			packetCount = 0
		}
	}
}

func createBpfFilter() (bpfFilter string) {
	myselfIPFilter := ""
	if !configs.GetVisibleCaptureMyself() {
		myselfIPFilter = "not ( "
		devices, err := pcap.FindAllDevs()
    if err != nil {
        log.Fatal(err)
    }

		for _, device := range devices {
			if device.Name == configs.GetTargetDeviceName() {
				for index, address := range device.Addresses {
					if index == len(device.Addresses) - 1 {
						myselfIPFilter += "src host " + address.IP.String()
					} else {
						myselfIPFilter += "src host " + address.IP.String() + " or "
					}
				}
				break
			}
		}

		myselfIPFilter += " )"
	}

	if configs.GetBpfFilter() == "" {
		bpfFilter = myselfIPFilter
	} else if myselfIPFilter == "" {
		bpfFilter = configs.GetBpfFilter()
	} else {
		bpfFilter = "( " + myselfIPFilter + " ) and ( " + configs.GetBpfFilter() + " )"
	}

	return
}

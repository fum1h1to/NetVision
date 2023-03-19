package network

import (
	"log"
	"time"

	"NetVision/configs"
	"github.com/google/gopacket"
	"github.com/google/gopacket/pcap"
)

type PacketCapture struct {
	DataOutputCh chan<- []*PacketData
	PacketAnalyser *PacketAnalyser
}

func CreatePacketCapture(dataOutput chan<- []*PacketData) *PacketCapture {
	packetAnalyser := CreatePacketAnalyser()

	return &PacketCapture{
		DataOutputCh: dataOutput,
		PacketAnalyser: packetAnalyser,
	}
}

func (p *PacketCapture) StartCapturing() {
	log.Println("Capture Start")
	
	handle, err := pcap.OpenLive(configs.GetTargetDeviceName(), 1024, configs.GetPromiscuousMode(), time.Duration(configs.GetCaptureDuration()) * time.Millisecond)
	if err != nil {
			log.Panicln(err)
	}
	defer handle.Close()

	bpfFilter := p.createBpfFilter()

	err = handle.SetBPFFilter(bpfFilter)
	if err != nil {
			log.Panicln(err)
	}

	packetSource := gopacket.NewPacketSource(handle, handle.LinkType())
	packetCount := 0
	validPacketCount := 0
	packetDatas := make([]*PacketData, configs.GetPacketLimitPerCaptureDuration())

	ticker := time.NewTicker(time.Duration(configs.GetCaptureDuration()) * time.Millisecond)
	defer func() {
		ticker.Stop()
	}()

	for {
		select {
		case packet := <- packetSource.Packets():
			if packetCount < configs.GetPacketLimitPerCaptureDuration() {
				data := p.PacketAnalyser.AnalysisPacket(packet)
				if IsValidPacketData(data) {
					packetDatas[validPacketCount] = data
					validPacketCount++
				}
				packetCount++
			}
		case <-ticker.C:
			if validPacketCount != 0 {
				packetBundler := CreatePacketBundler(packetDatas[:validPacketCount])
				p.DataOutputCh <- packetBundler.Bundle()
				validPacketCount = 0
			} 
			packetCount = 0
		}
	}
}

func (p *PacketCapture) createBpfFilter() (bpfFilter string) {
	myselfIPFilter := ""
	if !configs.GetVisibleCaptureMyself() {
		myselfIPFilter = "not ( "
		devices, err := pcap.FindAllDevs()
    if err != nil {
      log.Panicln(err)
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

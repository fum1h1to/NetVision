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
	
	deviceName, err := GetDefaultTargetDeviceName()
	if err != nil {
		log.Panicln(err)
	}

	handle, err := pcap.OpenLive(deviceName, 1024, configs.GetPromiscuousMode(), time.Duration(configs.GetCaptureDuration()) * time.Millisecond)
	if err != nil {
			log.Panicln(err)
	}
	defer handle.Close()
	
	log.Println("Capture Start")

	bpfFilter := p.createBpfFilter(deviceName)

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

	abuseIPCheckerTicker := time.NewTicker(time.Duration(configs.GetAbuseIPDBUpdateDuration()) * time.Hour)
	defer func() {
		abuseIPCheckerTicker.Stop()
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
				
		case <-abuseIPCheckerTicker.C:
			p.PacketAnalyser.UpdateAbuseIPChecker()
		}
	}
}

func (p *PacketCapture) createBpfFilter(targetDeviceName string) (bpfFilter string) {
	myselfIPFilter := ""
	if !configs.GetVisibleCaptureMyself() {
		devices, err := pcap.FindAllDevs()
    if err != nil {
      log.Panicln(err)
    }

		for _, device := range devices {
			if device.Name == targetDeviceName {
				if len(device.Addresses) == 0 {
					break
				}
				
				myselfIPFilter = "not ( "
				for index, address := range device.Addresses {
					if index == len(device.Addresses) - 1 {
						myselfIPFilter += "src host " + address.IP.String()
					} else {
						myselfIPFilter += "src host " + address.IP.String() + " or "
					}
				}
				
				myselfIPFilter += " )"
				break
			}
		}

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

// libpcapと同じ定数
const (
	PCAP_IF_LOOPBACK 													uint32 = 0x00000001	/* interface is loopback */
	PCAP_IF_UP 																uint32 = 0x00000002	/* interface is up */
	PCAP_IF_RUNNING 													uint32 = 0x00000004	/* interface is running */
	PCAP_IF_WIRELESS 													uint32 = 0x00000008	/* interface is wireless (*NOT* necessarily Wi-Fi!) */
	PCAP_IF_CONNECTION_STATUS 								uint32 = 0x00000030	/* connection status: */
	PCAP_IF_CONNECTION_STATUS_UNKNOWN 				uint32 = 0x00000000	/* unknown */
	PCAP_IF_CONNECTION_STATUS_CONNECTED 			uint32 = 0x00000010	/* connected */
	PCAP_IF_CONNECTION_STATUS_DISCONNECTED 		uint32 = 0x00000020	/* disconnected */
	PCAP_IF_CONNECTION_STATUS_NOT_APPLICABLE 	uint32 = 0x00000030	/* not applicable */
)

func GetDefaultTargetDeviceName() (deviceName string, err error) {
	if configs.GetTargetDeviceName() != "" {
		log.Println("Capture Interface: " + configs.GetTargetDeviceName())
		return configs.GetTargetDeviceName(), nil
	}

	devices, err := pcap.FindAllDevs()
	if err != nil {
		return "", err
	}

	invalidDevices := make([]pcap.Interface, 0)

	for _, device := range devices {
		if (device.Flags & PCAP_IF_UP == PCAP_IF_UP) && (device.Flags & PCAP_IF_RUNNING == PCAP_IF_RUNNING) && (device.Flags & PCAP_IF_CONNECTION_STATUS_CONNECTED == PCAP_IF_CONNECTION_STATUS_CONNECTED) {
			invalidDevices = append(invalidDevices, device)
		}
	}

	for _, device := range invalidDevices {
		if device.Flags & PCAP_IF_WIRELESS == PCAP_IF_WIRELESS {
			log.Println("Capture Interface: " + device.Name + " (Wireless)")
			return device.Name, nil
		}
	}

	log.Println("Capture Interface: " + invalidDevices[0].Name)
	return invalidDevices[0].Name, nil
}
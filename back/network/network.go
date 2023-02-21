package network

import (
    "log"
    "time"
	"DarkVision/configs"
	"DarkVision/util/ip2LatLng"
    "github.com/google/gopacket"
    "github.com/google/gopacket/pcap"
)

func StartCapturing() {
	log.Println("Start")
	
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

	for {
		select {
		case packet := <- packetSource.Packets():
			if packetCount < configs.PACKET_LIMIT_PER_CAPTURE_DURATION {
				data := analysisPacket(packet)
				if IsValidExchangeStruct(data) {
					log.Println(data)
				}

				packetCount++
			}
		default:
			packetCount = 0
		}
	}
}

func analysisPacket(packet gopacket.Packet) (exchangeData *ExchangeStruct){
	exchangeData = new(ExchangeStruct)

	if packet.NetworkLayer() != nil {
		srcip := packet.NetworkLayer().NetworkFlow().Src().String()
		exchangeData.Srcip = srcip
		
		lat, lng := ip2LatLng.GetLatLng(srcip)
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
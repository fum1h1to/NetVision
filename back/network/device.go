package network

import (
	"log"
	"strings"
	
	"github.com/google/gopacket/pcap"
)

func GetLoopbackDeviceName() string {
    // Find all devices
    devices, err := pcap.FindAllDevs()
    if err != nil {
        log.Fatal(err.Error())
    }
    for _, device := range devices {
        // for Windows
        if strings.Contains(strings.ToLower(device.Name), "loopback") ||
            // for Xubuntu
            device.Name == "lo" {
            return device.Name
        }
    }
    return ""
}
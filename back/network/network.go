package network

import (
    // "fmt"
    "log"
    "time"
	"DarkVision/configs"
    "github.com/google/gopacket"
    // "github.com/google/gopacket/layers"
    "github.com/google/gopacket/pcap"
)

func StartCapturing() {
	log.Println("Start")
    loopbackDevice := configs.TARGET_DEVICENAME
    if loopbackDevice == "" {
        log.Println("No loopback devices")
        return
    }
    handle, err := pcap.OpenLive(loopbackDevice, 1024, false, 1*time.Second)
    if err != nil {
        log.Fatal(err)
    }
    defer handle.Close()
    // Filtering capture targets
    if err != nil {
        log.Fatal(err)
    }
    packetSource := gopacket.NewPacketSource(handle, handle.LinkType())
   // Get decoded packets through chann
    for packet := range packetSource.Packets() {
        log.Println("S-------S")
        log.Println(packet)
        log.Println("E-------E")
    }
}
package ip2LatLng

import (
	"log"
	"net"
	"DarkVision/configs"
	"github.com/oschwald/geoip2-golang"
)

func GetLatLng(ip string) (lat float64, lng float64) {
	db, err := geoip2.Open(configs.GEOIP_DB_PATH)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	parsedIp := net.ParseIP(ip)
	record, err := db.City(parsedIp)
	if err != nil {
		log.Fatal(err)
	}
	
	return record.Location.Latitude, record.Location.Longitude
}
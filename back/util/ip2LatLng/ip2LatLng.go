package ip2LatLng

import (
	"log"
	"net"
	"DarkVision/configs"
	"github.com/oschwald/geoip2-golang"
)

var (
	Db *geoip2.Reader
)

func init() {
	var err error
	Db, err = geoip2.Open(configs.GEOIP_DB_PATH)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("ip2LatLng init success")
}

func GetLatLng(ip string) (lat float64, lng float64) {
	parsedIp := net.ParseIP(ip)
	record, err := Db.City(parsedIp)
	if err != nil {
		log.Fatal(err)
	}
	
	return record.Location.Latitude, record.Location.Longitude
}
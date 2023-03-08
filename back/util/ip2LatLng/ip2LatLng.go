package ip2LatLng

import (
	"log"
	"net"
	"DarkVision/configs"
	"github.com/oschwald/geoip2-golang"
)

type Ip2LatLngExchanger struct {
	Db *geoip2.Reader
}

func CreateIp2LatLngExchanger() *Ip2LatLngExchanger {
	Db, err := geoip2.Open(configs.GetGeoipDbPath())
	if err != nil {
		log.Panicln(err)
	}
	log.Println("ip2LatLng init success")

	return &Ip2LatLngExchanger{
		Db: Db,
	}
}

func (e *Ip2LatLngExchanger) GetLatLng(ip string) (lat float64, lng float64, err error) {
	parsedIp := net.ParseIP(ip)
	record, err := e.Db.City(parsedIp)
	if err != nil {
		return 0, 0, err
	}
	
	return record.Location.Latitude, record.Location.Longitude, nil
}
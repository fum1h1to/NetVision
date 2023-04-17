package ip2LatLng

import (
	"log"
	"net"
	"os"
	"path"
	"io"
	"time"
	"net/http"
	"path/filepath"
	"compress/gzip"

	"NetVision/configs"
	"github.com/oschwald/geoip2-golang"
)

type Ip2LatLngExchanger struct {
	Db *geoip2.Reader
}

func getGetIpDBName() (dbName string) {
	return "dbip_city_lite.mmdb"
}

func downloadGeoipDb() (err error) {
	geoipDbDir := path.Dir(configs.GetGeoipDbOutputPath())
	_, err_d := os.Stat(geoipDbDir)
	if os.IsNotExist(err_d) {
		os.MkdirAll(geoipDbDir, 0755)
	}

	dbDate := time.Now().Format("2006-01")

	method := "GET"
	url := "https://download.db-ip.com/free/dbip-city-lite-" + dbDate + ".mmdb.gz"
	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		return err
	}

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	gr, err := gzip.NewReader(res.Body)

	file, err := os.Create(filepath.Join(configs.GetGeoipDbOutputPath(), getGetIpDBName()))
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = io.Copy(file, gr)
	if err != nil {
		return err
	}

	log.Println("download geoip db success")
	return nil
}

func CreateIp2LatLngExchanger() *Ip2LatLngExchanger {
	openPath := "";

	_, err := os.Stat(configs.GetGeoipDbPath())
	if os.IsNotExist(err) {
		log.Println("Your geoip db not found")

		_, err := os.Stat(filepath.Join(configs.GetGeoipDbOutputPath(), getGetIpDBName()))
		if os.IsNotExist(err) {
			log.Println("geoip db not found, download it")
			err := downloadGeoipDb()
			if err != nil {
				log.Panicln(err)
			}
		}
		openPath = filepath.Join(configs.GetGeoipDbOutputPath(), getGetIpDBName())
	} else {
		openPath = configs.GetGeoipDbPath()
	}

	Db, err := geoip2.Open(openPath)
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
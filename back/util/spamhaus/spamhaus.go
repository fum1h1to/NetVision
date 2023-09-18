package spamhaus

import (
	"bufio"
	"bytes"
	"log"
	"os"
	"io"
	"net/http"
	"path"
	"path/filepath"
	"errors"
	"strings"
	"net"

	"NetVision/configs"
	"NetVision/util/global"
)

type SpamhausManager struct {
	blackListMap []net.IPNet
}

func CreateSpamhausManager() *SpamhausManager {

	if !configs.GetUseSpamhaus() {
		log.Println("no use Spamhaus")

		global.SetUseSpamhaus(false)
		
		return &SpamhausManager{
			blackListMap: make([]net.IPNet, 0),
		}
	}

	content, err := getBlackListFromSpamhaus()
	if err != nil {
		log.Println("Error get blacklist from Spamhaus. So no use Spamhaus:", err)
		
		global.SetUseSpamhaus(false)
		return &SpamhausManager{
			blackListMap: make([]net.IPNet, 0),
		}
	}

	saveBlackList(content)
	blacklistMap := makeBlacklistMap(content)

	global.SetUseSpamhaus(true)
	log.Println("Spamhaus init success")
	return &SpamhausManager{
		blackListMap: blacklistMap,
	}

}

func (s *SpamhausManager) IsBlackList(ip string) bool {
	for _, ipnet := range s.blackListMap {
		if ipnet.Contains(net.ParseIP(ip)) {
			return true
		}
	}
	return false
}

func (s *SpamhausManager) UpdateBlackList() {

	content, err := getBlackListFromSpamhaus()
	if err != nil {
		log.Println("Error get blacklist from Spamhaus. So no update was made:", err)

		return
	}

	saveBlackList(content)
	blacklistMap := makeBlacklistMap(content)

	s.blackListMap = blacklistMap
	
	global.SetUseSpamhaus(true)
	log.Println("update Spamhaus blacklist")

}

func makeBlacklistMap(spamlistByte []byte) (blacklistMap []net.IPNet) {
	blacklistMap = make([]net.IPNet, 0)
	scanner := bufio.NewScanner(bytes.NewReader(spamlistByte))

	for scanner.Scan() {
		line := scanner.Text()
		if line[0] == ';' {
			continue
		}
		index := strings.Index(line, " ; ")
		ip := line[:index]
		_, ipnet, err := net.ParseCIDR(ip)
		if err != nil {
			log.Println("Error parse CIDR:", ip)
			continue
		}
		blacklistMap = append(blacklistMap, *ipnet)
	}

	return
}

func getBlackListFromSpamhaus() (spamlistByte []byte, err error) {
	response, err := http.Get("https://www.spamhaus.org/drop/drop.txt")
	if err != nil {
		return nil, err
	}

	body, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	if response.StatusCode != 200 {
		return nil, errors.New("Error get blacklist from Spamhaus. Status code is not 200.")
	}

	return body, nil
}

func saveBlackList(spamlistByte []byte) {
	dir, _ := path.Split(configs.GetSpamhausDataOutputPath())
	err := os.MkdirAll(dir, 0755)
	if err != nil && !os.IsExist(err) {
		log.Panicln(err)
	}

	err = os.WriteFile(filepath.Join(configs.GetSpamhausDataOutputPath(), "drop.txt"), spamlistByte, 0644)
	if err != nil {
		log.Panicln(err)
	}
}
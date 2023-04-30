package blocklist_de

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

	"NetVision/configs"
	"NetVision/util/global"
)

type BlocklistDeManager struct {
	blackListMap map[string]int
}

func CreateBlocklistDeManager() *BlocklistDeManager {

	content, err := getBlackListFromBlocklistDe()
	if err != nil {
		log.Println("Error get blacklist from blocklist.de. So no use blocklist.de:", err)
		
		global.SetUseBlocklistDe(false)
		return &BlocklistDeManager{
			blackListMap: make(map[string]int),
		}
	}

	saveBlackList(content)

	blacklistMap := make(map[string]int)
	for _, data := range content {
		blacklistMap[data] = 0
	}

	
	global.SetUseBlocklistDe(true)
	log.Println("blocklist.de init success")
	return &BlocklistDeManager{
		blackListMap: blacklistMap,
	}

}

func (b *BlocklistDeManager) IsBlackList(ip string) bool {
	_, ok := b.blackListMap[ip]
	return ok
}

func (b *BlocklistDeManager) UpdateBlackList() {

	content, err := getBlackListFromBlocklistDe()
	if err != nil {
		log.Println("Error get blacklist from blocklist.de. So no update was made:", err)
		return
	}

	saveBlackList(content)

	blacklistMap := make(map[string]int)
	for _, data := range content {
		blacklistMap[data] = 0
	}

	b.blackListMap = blacklistMap
	
	global.SetUseBlocklistDe(true)
	log.Println("update blocklist.de blacklist")

}

func getBlackListFromBlocklistDe() (blocklistData []string, err error) {
	response, err := http.Get("https://lists.blocklist.de/lists/all.txt")
	if err != nil {
		return nil, err
	}

	body, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	if response.StatusCode != 200 {
		return nil, errors.New("Error get blacklist from blocklist.de. Status code is not 200.")
	}

	scanner := bufio.NewScanner(bytes.NewReader(body))

	for scanner.Scan() {
		line := scanner.Text()
		if line[0] == '#' {
			continue
		}
		blocklistData = append(blocklistData, line)
	}

	return blocklistData, nil
}

func saveBlackList(blocklistData []string) {
	dir, _ := path.Split(configs.GetBlocklistDeDataOutputPath())
	err := os.MkdirAll(dir, 0755)
	if err != nil && !os.IsExist(err) {
		log.Panicln(err)
	}

	outputStr := ""

	for _, data := range blocklistData {
		outputStr += data + "\n"
	}

	err = os.WriteFile(filepath.Join(configs.GetBlocklistDeDataOutputPath(), "all.txt"), []byte(outputStr), 0644)
	if err != nil {
		log.Panicln(err)
	}
}
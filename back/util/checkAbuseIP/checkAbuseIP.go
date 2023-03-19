package checkAbuseIP

import (
	"log"
	"time"
	"os"
	"io"
	"encoding/json"
	"net/http"

	"NetVision/configs"
)

type AbuseIPBlackList struct {
	Meta struct {
		GeneratedAt time.Time `json:"generatedAt"`
	} `json:"meta"`
	Data []struct {
		IPAddress            string    `json:"ipAddress"`
		AbuseConfidenceScore int       `json:"abuseConfidenceScore"`
		LastReportedAt       time.Time `json:"lastReportedAt"`
	} `json:"data"`
	Errors []struct {
		Detail string `json:"detail"`
		Status int    `json:"status"`
	} `json:"errors"`
}

type AbuseIPChecker struct {
	abuseIPBlackList *AbuseIPBlackList
	blackListMap map[string]int
}

func CreateAbuseIPChecker() *AbuseIPChecker {

	content, err := os.ReadFile(configs.GetAbuseIPDBBlacklistPath())

	// ファイルが存在しない場合は、AbuseIPDBから取得する
	if err != nil {
		if os.IsNotExist(err) {
			content = getBlackListFromAbuseIPDB()
			log.Println("not exists abuseIPDB blacklist file. created new file.")
		} else {
			log.Panicln("Error loading config file: ", err)
		}
	}

	abuseIPBlackList := &AbuseIPBlackList{}
  json.Unmarshal(content, abuseIPBlackList)

	// ファイルの更新日時を確認、1日以上経過している場合は、AbuseIPDBから取得する
	utc, _ := time.LoadLocation("UTC")
	if time.Now().In(utc).Sub(abuseIPBlackList.Meta.GeneratedAt).Hours() >= 24 {
		content = getBlackListFromAbuseIPDB()
		abuseIPBlackList = &AbuseIPBlackList{}
  	json.Unmarshal(content, abuseIPBlackList)
		log.Println("abuseIPDB blacklist file is old. updated file.")
	}

	// mapに変換
	blackListMap := make(map[string]int)
	for _, v := range abuseIPBlackList.Data {
		blackListMap[v.IPAddress] = v.AbuseConfidenceScore
	}

	log.Println("abuseIPDB init success")

	return &AbuseIPChecker{
		abuseIPBlackList: abuseIPBlackList,
		blackListMap: blackListMap,
	}
}

func (c *AbuseIPChecker) CheckIP(ip string) bool {
	_, ok := c.blackListMap[ip]
	return ok
}

func (c *AbuseIPChecker) GetAbuseIPScore(ip string) int {
	score, ok := c.blackListMap[ip]
	if ok {
		return score
	} else {
		return 0
	}
}

func getBlackListFromAbuseIPDB() (abuseIPData []byte) {
	method := "GET"
	url := "https://api.abuseipdb.com/api/v2/blacklist"
	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		log.Panicln(err)
	}

	// クエリパラメータの設定
	q := req.URL.Query()
	q.Add("confidenceMinimum", "100")
	q.Add("limit", "10000")
	req.URL.RawQuery = q.Encode()

	// Headerの設定
	req.Header.Add("Key", configs.GetAbuseIPDBAPIKey())
	req.Header.Add("Accept", "application/json")

	// リクエストの実行
	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		log.Panicln(err)
	}
	defer res.Body.Close()

	abuseIPData, err = io.ReadAll(res.Body)
	if err != nil {
		log.Panicln(err)
	}

	abuseIPBlackList := &AbuseIPBlackList{}
  json.Unmarshal(abuseIPData, abuseIPBlackList)
	if len(abuseIPBlackList.Errors) > 0 {
		log.Panicln(abuseIPBlackList.Errors[0].Detail)
	}
	
	// ファイル出力
	err_f := os.WriteFile(configs.GetAbuseIPDBBlacklistPath(), abuseIPData, 0644)
	if err_f != nil {
		log.Panicln(err_f)
	}

	return 
}
package configs

const (
	// 可視化するネットワークインターフェース名
	TARGET_DEVICENAME = "eth0"

	// msで指定。
	CAPTURE_DURATION = 1000

	// CAPTURE_DURATIONの値の間に最大で取得するパケット数。超えた場合は破棄される。
	PACKET_LIMIT_PER_CAPTURE_DURATION = 2000

	// BPF フィルタ
	BPF_FILTER = ""

	// GeoIPのデータベースのパス
	GEOIP_DB_PATH = "./GeoLite2-City_20230127/GeoLite2-City.mmdb"
	
)	
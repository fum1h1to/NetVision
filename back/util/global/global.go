package global

var (
	useAbuseIPDB bool = false
)

func SetUseAbuseIPDB(use bool) {
	useAbuseIPDB = use
}

func GetUseAbuseIPDB() bool {
	return useAbuseIPDB
}

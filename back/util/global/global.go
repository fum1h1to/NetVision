package global

var (
	useAbuseIPDB bool = false
	useBlocklistDe bool = false
)

func SetUseAbuseIPDB(use bool) {
	useAbuseIPDB = use
}

func GetUseAbuseIPDB() bool {
	return useAbuseIPDB
}

func SetUseBlocklistDe(use bool) {
	useBlocklistDe = use
}

func GetUseBlocklistDe() bool {
	return useBlocklistDe
}

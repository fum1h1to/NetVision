package global

var (
	useAbuseIPDB bool = false
	useSpamhaus bool = false
	useBlocklistDe bool = false
)

func SetUseAbuseIPDB(use bool) {
	useAbuseIPDB = use
}

func GetUseAbuseIPDB() bool {
	return useAbuseIPDB
}

func SetUseSpamhaus(use bool) {
	useSpamhaus = use
}

func GetUseSpamhaus() bool {
	return useSpamhaus
}

func SetUseBlocklistDe(use bool) {
	useBlocklistDe = use
}

func GetUseBlocklistDe() bool {
	return useBlocklistDe
}

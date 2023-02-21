package network

type ExchangeStruct struct {
	From struct {
		Lat float64	`json:"lat"`
		Lng float64 `json:"lng"`
	} `json:"from"`
	Srcip string `json:"srcip"`
	Srcport string `json:"srcport"`
	ProtocolType string `json:"protocol_type"`
}

func IsValidExchangeStruct(exchangeData *ExchangeStruct) bool {
	if exchangeData.Srcip == "" {
		return false
	}
	if exchangeData.From.Lat == 0 && exchangeData.From.Lng == 0 {
		return false
	}

	return true
}
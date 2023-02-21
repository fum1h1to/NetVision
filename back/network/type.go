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
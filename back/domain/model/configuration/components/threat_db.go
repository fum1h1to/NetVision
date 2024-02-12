package components

import (

)

type ThreatDBSetting struct {
	AbuseIP AbuseIPSetting
	Spamhaus SpamhausSetting
	BlocklistDe BlocklistDeSetting
}

type ThreatDBSettingBase struct {
	UseDB bool
	DataOutputPath string
	DBUpdateDuration int
}

type AbuseIPSetting struct {
	ThreatDBSettingBase
	APIKey string
}

type SpamhausSetting struct {
	ThreatDBSettingBase
}

type BlocklistDeSetting struct {
	ThreatDBSettingBase
}

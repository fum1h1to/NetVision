package components

import (

)

type ThreatDBSettingBase struct {
	UseDB bool
	DataOutputPath string
	DBUpdateDuration int
}

type AbuseIPSetting struct {
	ThreatDBSettingBase
	APIKey string
	ThresholdConfidenceScore int
}

type SpamhausSetting struct {
	ThreatDBSettingBase
}

type BlocklistDe struct {
	ThreatDBSettingBase
}

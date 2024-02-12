package components

import (
	"NetVision/domain/model"
)

type VisualizationSetting struct {
	EarthRadius float64
	EarthRotate bool
	PacketGoal model.Location
	PacketLimit int
	PacketOrbitHeight float64
	PacketGoalTime int
	MaxPacketScale float64
	MaxScalePacketCount float64
	FlowCounterHeightRate float64
	FlowCounterMaxHeight int
	DefaultFlowCounterColor model.Color
	ClickedFlowCounterColor model.Color

	PacketVisualization PacketVisualizationSetting
}

type PacketVisualizationSetting struct {
	Default DefaultPacketVisualizationSetting
	AbuseIP AbuseIPPacketVisualizationSetting
	Spamhaus SpamhausPacketVisualizationSetting
	BlocklistDe BlacklistDePacketVisualizationSetting
}

type PacketVisualizationSettingBase struct {
	PacketColor model.Color
	ModelFileName string
}

type DefaultPacketVisualizationSetting struct {
	PacketVisualizationSettingBase
}

type AbuseIPPacketVisualizationSetting struct {
	PacketVisualizationSettingBase
	ThresholdConfidenceScore int
}

type SpamhausPacketVisualizationSetting struct {
	PacketVisualizationSettingBase
}

type BlacklistDePacketVisualizationSetting struct {
	PacketVisualizationSettingBase
}




package components

import (
	
)

type NetworkSetting struct {
	TargetDeviceName string
	CaptureDuration int
	PacketLimitPerCaptureDuration int
	VisibleCaptureMyself bool
	BpfFilter string
	PromiscuousMode bool
}


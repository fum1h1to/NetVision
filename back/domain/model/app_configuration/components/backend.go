package components

import (
	"net/netip"
)

type BackendSetting struct {
	ServerIP netip.Addr
	ServerPort int
	ServerClientContentPath string
	ServerAutoOpenBrowser bool
}


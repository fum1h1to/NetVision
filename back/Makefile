DEV_OUTPUT_DIR = ./dev
BUILD_OUTPUT_DIR = ./dist

BUILD_OUTPUT_DIR_WINDOWS = $(BUILD_OUTPUT_DIR)/windows
BUILD_OUTPUT_DIR_LINUX = $(BUILD_OUTPUT_DIR)/linux

develop:
	go build -o $(DEV_OUTPUT_DIR)/net_vision ./cmd/net_vision/main.go
	go build -o $(DEV_OUTPUT_DIR)/find_device ./cmd/find_device/main.go

build:
	rm -rf $(BUILD_OUTPUT_DIR)

	GOOS=windows GOARCH=amd64 go build -o $(BUILD_OUTPUT_DIR_WINDOWS)/NetVision_windows_amd64.exe ./cmd/net_vision/main.go
	GOOS=windows GOARCH=amd64 go build -o $(BUILD_OUTPUT_DIR_WINDOWS)/find_device_windows_amd64.exe ./cmd/find_device/main.go

	GOOS=linux GOARCH=amd64 go build -o $(BUILD_OUTPUT_DIR_LINUX)/NetVision_linux_amd64 ./cmd/net_vision/main.go
	GOOS=linux GOARCH=amd64 go build -o $(BUILD_OUTPUT_DIR_LINUX)/find_device_linux_amd64 ./cmd/find_device/main.go

	mkdir -p $(BUILD_OUTPUT_DIR_WINDOWS)/resources/GeoIP
	mkdir -p $(BUILD_OUTPUT_DIR_LINUX)/resources/GeoIP
	cp config_example.yaml $(BUILD_OUTPUT_DIR_WINDOWS)/config.yaml
	cp config_example.yaml $(BUILD_OUTPUT_DIR_LINUX)/config.yaml
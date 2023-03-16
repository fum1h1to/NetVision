DEV_OUTPUT_DIR = ./dev
BUILD_OUTPUT_DIR = ./dist

develop:
	go build -o $(DEV_OUTPUT_DIR)/dark_vision ./cmd/dark_vision/main.go
	go build -o $(DEV_OUTPUT_DIR)/find_device ./cmd/find_device/main.go

build:
	rm -rf $(BUILD_OUTPUT_DIR)

	GOOS=windows GOARCH=amd64 go build -o $(BUILD_OUTPUT_DIR)/DarkVision_windows_amd64.exe ./cmd/dark_vision/main.go
	GOOS=windows GOARCH=amd64 go build -o $(BUILD_OUTPUT_DIR)/find_device_windows_amd64.exe ./cmd/find_device/main.go
	cp config_example.yaml $(BUILD_OUTPUT_DIR)/config.yaml
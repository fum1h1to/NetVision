DEV_OUTPUT_DIR = ./dev
BUILD_OUTPUT_DIR = ./dist

PCAPV=1.10.3

develop:
	go build -o $(DEV_OUTPUT_DIR)/net_vision ./cmd/net_vision/main.go
	go build -o $(DEV_OUTPUT_DIR)/find_device ./cmd/find_device/main.go

build:
	rm -rf $(BUILD_OUTPUT_DIR)

	cd / && \
		wget http://www.tcpdump.org/release/libpcap-$(PCAPV).tar.gz && \
    tar xvf libpcap-$(PCAPV).tar.gz && \
    cd libpcap-$(PCAPV) && \
    ./configure --with-pcap=linux && \
    make

	export LD_LIBRARY_PATH="-L/libpcap-$(PCAPV)"
	export CGO_LDFLAGS="-L/libpcap-$(PCAPV)"
	export CGO_CPPFLAGS="-I/libpcap-$(PCAPV)"

	GOOS=windows GOARCH=amd64 go build -o $(BUILD_OUTPUT_DIR)/NetVision_windows_amd64.exe ./cmd/net_vision/main.go
	GOOS=windows GOARCH=amd64 go build -o $(BUILD_OUTPUT_DIR)/find_device_windows_amd64.exe ./cmd/find_device/main.go
	cp config_example.yaml $(BUILD_OUTPUT_DIR)/config.yaml
#!/usr/bin/env bash
tcpreplay -i eth0 ./test-data/pcap/darknet_00036_20221210090000 &
air -c .air.toml
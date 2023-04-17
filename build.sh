#!/usr/bin/env bash
rm -rf ./build
mkdir -p ./build

docker build --no-cache -f ./Dockerfile.build -t fum1h1to/net-vision-builder:build .
docker create --name netvision-builder fum1h1to/net-vision-builder:build
docker cp netvision-builder:/build ./
docker rm netvision-builder

mkdir -p ./build/resources/GeoIP
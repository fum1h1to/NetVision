#!/usr/bin/env bash
rm -rf ./build
mkdir -p ./build

docker build --no-cache -f ./Dockerfile.build -t fum1h1to/net-vision-builder:build .
docker create --name netvision-builder fum1h1to/net-vision-builder:build
docker cp netvision-builder:/build ./
docker cp netvision-builder:/build/NOTICE.txt ./
docker rm netvision-builder
cp ./LICENSE ./build/windows
cp ./LICENSE ./build/linux
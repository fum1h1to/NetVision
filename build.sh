#!/usr/bin/env bash
rm -rf ./build
mkdir -p ./build

docker build -f ./Dockerfile.build -t fum1h1to/dark-vision:build .
docker create --name darkvision-builder fum1h1to/dark-vision:build
docker cp darkvision-builder:/build ./
docker rm darkvision-builder

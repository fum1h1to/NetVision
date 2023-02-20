FROM golang:1.19.1-alpine
RUN apk add --update && apk add git alpine-sdk build-base libpcap-dev
WORKDIR /go/src
ADD . /go/src
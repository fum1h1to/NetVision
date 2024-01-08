FROM golang:1.19.1
RUN apt update && apt upgrade -y 
RUN apt install -y git libpcap-dev tcpreplay
WORKDIR /go/src
ADD ./go.mod /go/src
RUN go mod tidy
RUN go install github.com/cosmtrek/air@v1.29.0
RUN go install github.com/Songmu/gocredits/cmd/gocredits@v0.3.0
CMD ["./docker/dev-startup.sh"]
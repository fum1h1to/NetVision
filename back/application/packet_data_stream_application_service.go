package application

import (
	"NetVision/domain/model"
)


type PacketDataStreamApplicationService struct {
	packetDataStream *model.PacketDataStream
	clientRepository model.IClientRepository
}

func NewPacketDataStreamApplicationService(
	clientRepository model.IClientRepository,
) *PacketDataStreamApplicationService {
	return &PacketDataStreamApplicationService{
		packetDataStream: &model.PacketDataStream{
			
		}
		clientRepository: clientRepository
	}
}

func (p *PacketDataStreamApplicationService) RunLoop() {
	for {
		select {
		case client := <-h.RegisterCh:
			h.register(client)

		case client := <-h.UnRegisterCh:
			h.unregister(client)

		case message := <-h.BroadcastCh:
			h.broadCastToAllClient(message)
		}
	}
}

package service

import (
	"log"

	"NetVision/domain/model"
)

type CaptureDataStreamService struct {
}

func NewCaptureDataStreamService() *CaptureDataStreamService {
	return &CaptureDataStreamService{}
}

func (c *CaptureDataStreamService) CheckClose(client model.Client) {

}
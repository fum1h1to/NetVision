package domain

import (
	// "log"

	"github.com/gorilla/websocket"
)

type Client struct {
	ws *websocket.Conn
	SendCh chan []byte
}

func NewClient(ws *websocket.Conn) *Client {
	return &Client{
		ws:     ws,
		SendCh: make(chan []byte),
	}
}

func (c *Client) WriteLoop(unregister chan<- *Client) {
	defer func() {
		c.disconnect(unregister)
	}()

	for {
		message := <-c.SendCh

		w, err := c.ws.NextWriter(websocket.TextMessage)
		if err != nil {
			return
		}
		w.Write(message)

		if err := w.Close(); err != nil {
			return
		}
	}
}

func (c *Client) disconnect(unregister chan<- *Client) {
	unregister <- c
	c.ws.Close()
}
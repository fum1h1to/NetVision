package domain

import (
	"log"

	"github.com/gorilla/websocket"
)

var clientId int = 0

type Client struct {
	Id int
	ws *websocket.Conn
	SendCh chan []byte
}

func NewClient(ws *websocket.Conn) *Client {
	id := clientId
	clientId += 1
	return &Client{
		Id: id,
		ws: ws,
		SendCh: make(chan []byte),
	}
}

func (c *Client) CheckClose(unregister chan<- *Client) {
	defer func() {
		c.disconnect(unregister)
	}()

	for {
		_, _, err := c.ws.ReadMessage()

		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("unexpected close error: %v", err)
			}
			break
		}
	}
}

func (c *Client) WriteLoop() {
	defer func() {
		c.ws.Close()
	}()

	for {
		message := <-c.SendCh

		w, err := c.ws.NextWriter(websocket.TextMessage)
		if err != nil {
			log.Printf("Error: %s", err)
			return
		}
		w.Write(message)
		
		if err := w.Close(); err != nil {
			log.Printf("Error: %s", err)
			return
		}
	}
}

func (c *Client) disconnect(unregister chan<- *Client) {
	unregister <- c
	c.ws.Close()
}
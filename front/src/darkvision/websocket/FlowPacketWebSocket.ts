import { WEBSOCKET_RECONNECT_INTERVAL, WEBSOCKET_URL } from "../constant";
import { PacketData } from "../models/PacketData";

export class FlowPacketWebSocket {
  private isOpen: boolean = false;
  private isNewFlowPacketList: boolean = false;
  private flowPacketList: PacketData[] = [];

  constructor() {
    this.connect();
  }

  private connect() {
    const ws = new WebSocket(WEBSOCKET_URL);

    ws.onopen = () => {
      this.isOpen = true;
    }

    ws.onmessage = (event) => {
      this.flowPacketList = JSON.parse(event.data);
      this.isNewFlowPacketList = true;
    }
    
    ws.onclose = () => {
      this.isOpen = false;
      setTimeout(() => {
        this.connect();
      }, WEBSOCKET_RECONNECT_INTERVAL);
    }

    ws.onerror = () => {
      this.isOpen = false;
      ws.close();
    }
  }

  public getIsOpen(): boolean {
    return this.isOpen;
  }

  public getIsNewFlowPacketList(): boolean {
    return this.isNewFlowPacketList;
  }

  public getFlowPacketList(): PacketData[] {
    this.isNewFlowPacketList = false;
    return this.flowPacketList;
  }

}

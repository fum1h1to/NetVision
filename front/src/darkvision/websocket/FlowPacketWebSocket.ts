import { PacketData } from "../models/PacketData";

export class FlowPacketWebSocket {
  private isOpen: boolean = false;
  private isNewFlowPacketList: boolean = false;
  private flowPacketList: PacketData[] = [];
  private websocketURL: string = "";

  constructor() {
    fetch("/data/server.json")
    .then((response) => response.json()).then((data) => {
      this.websocketURL = `ws://${data.server.host}:${data.server.port}/${data.server.websocket_path}`
      this.connect();
    });
  }

  private async connect() {

    const ws = new WebSocket(this.websocketURL);

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
      }, globalThis.constantManager.getWEBSOCKET_RECONNECT_INTERVAL());
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

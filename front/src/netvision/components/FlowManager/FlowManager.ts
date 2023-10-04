import * as THREE from 'three';
import { PacketData } from '../../models/PacketData';
import { FlowPacketWebSocket } from '../../websocket/FlowPacketWebSocket';
import { Flow } from '../Flow/Flow';
import { FlowCounterManager } from '../FlowCounterManager/FlowCounterManager';
import { FlowModelManager } from '../Flow/FlowModelManager';

export class FlowManager {
  private parentScene: THREE.Scene;
  private flowPacketWS: FlowPacketWebSocket;
  private animateFlowPacketList: Flow[] = [];
  private flowPacketNum: number = 0;
  private flowCounterManager: FlowCounterManager;
  private flowModelManager: FlowModelManager;
  private animateOK: boolean = false;

  constructor(scene: THREE.Scene) {
    this.parentScene = scene;

    this.flowPacketWS = new FlowPacketWebSocket();

    this.flowCounterManager = new FlowCounterManager(
      scene,
      globalThis.constantManager.getEARTH_RADIUS()
    );

    this.flowModelManager = new FlowModelManager();
  }

  public async init() {
    // モデルのロード
    await this.flowModelManager.init();
    
    this.animateOK = true;
  }

  private createFlow(packetData: PacketData) {
    const now = this.flowPacketNum;
    this.flowPacketNum += 1;
    const flow = new Flow(
      now, // id
      this.parentScene, // scene
      this.flowModelManager, // modelManager
      packetData.from, // start
      globalThis.constantManager.getPACKET_GOAL(), // goal
      globalThis.constantManager.getEARTH_RADIUS(), // radius
      globalThis.constantManager.getPACKET_ORBIT_HEIGHT(), // height
      globalThis.constantManager.getPACKET_GOAL_TIME(), // duration
      packetData, // packetData
      (packet) => {
        this.animateFlowPacketList.push(packet);
        this.flowCounterManager.addFlowCounter(packet.getIp(), packet.getLatLngAndPacketCount(), packet.getPacketCount());
      }, // onCreate
      (packet) => {
        this.animateFlowPacketList.splice(this.animateFlowPacketList.indexOf(packet), 1);
      }, // onGoal
    );
    flow.create();
  }

  public update() {
    if (!this.animateOK) return;

    if (this.flowPacketWS.getIsNewFlowPacketList()) {
      const activeFlowPacketList = this.flowPacketWS.getFlowPacketList().slice(0, globalThis.constantManager.getGET_PACKET_LIMIT());
      activeFlowPacketList.map((flowPacket) => {
        this.createFlow(flowPacket);
      });
    }

    this.animateFlowPacketList.map((flowPacket) => {
      flowPacket.update();
    });

  }

}
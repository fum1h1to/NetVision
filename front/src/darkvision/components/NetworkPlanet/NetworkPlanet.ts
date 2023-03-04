import * as THREE from 'three';
import { EARTH_RADIUS } from '../../constant';
import { LatLng } from '../../models/LatLng';
import { FlowPacketWebSocket } from '../../websocket/FlowPacketWebSocket';
import { Earth } from '../Earth/Earth';
import { Flow } from '../Flow/Flow';
import FlowWorker from "../Flow/worker/FlowWorker?worker";

export class NetworkPlanet {
  private parentScene: THREE.Scene;
  private readonly PACKET_GOAL: LatLng = { lat: 35, lng: 140 };
  private flowPacketWS: FlowPacketWebSocket;
  private flowPacketList: Flow[] = [];
  private flowPacketNum: number = 0;
  private earth: Earth;
  private flowWorker: Worker;

  constructor(scene: THREE.Scene) {
    this.parentScene = scene;
    this.earth = new Earth(scene, EARTH_RADIUS, new THREE.Vector3(0, 0, 0));

    scene.add(this.earth.mesh);

    this.flowPacketWS = new FlowPacketWebSocket();

    this.flowWorker = new FlowWorker();

    const flow = new Flow(
      this.flowPacketNum,
      this.parentScene,
      this.flowPacketList,
      this.flowWorker,
      { lat: 0, lng: 0 },
      this.PACKET_GOAL,
      EARTH_RADIUS,
      4,
      4,
    );
    this.flowPacketNum += 1;
    flow.create();
    
    // setInterval(() => {
    //   console.log(this.flowPacketList);
    // }, 1000);
  }

  public update() {
    if (this.flowPacketWS.getIsNewFlowPacketList()) {
      const flowPacketList = this.flowPacketWS.getFlowPacketList().slice(0, 500);
      flowPacketList.map((flowPacket) => {
        const now = this.flowPacketNum;
        this.flowPacketNum += 1;
        const flow = new Flow(
          now,
          this.parentScene,
          this.flowPacketList,
          this.flowWorker,
          flowPacket.from,
          this.PACKET_GOAL,
          EARTH_RADIUS,
          3,
          4,
        );
        flow.create();
      });
    }

    this.flowPacketList.map((flowPacket) => {
      flowPacket.update();
    });

  }

}
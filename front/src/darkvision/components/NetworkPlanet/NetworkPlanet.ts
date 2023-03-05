import * as THREE from 'three';
import { EARTH_RADIUS, GET_PACKET_LIMIT, PACKET_GOAL, PACKET_GOAL_TIME, PACKET_ORBIT_HEIGHT } from '../../constant';
import { FlowPacketWebSocket } from '../../websocket/FlowPacketWebSocket';
import { Earth } from '../Earth/Earth';
import { Flow } from '../Flow/Flow';
import FlowWorker from "../Flow/worker/FlowWorker?worker";

export class NetworkPlanet {
  private parentScene: THREE.Scene;
  private flowPacketWS: FlowPacketWebSocket;
  private flowPacketList: Flow[] = [];
  private flowPacketNum: number = 0;
  private earth: Earth;
  private flowWorker: Worker;

  private flowpacketGeometry: THREE.BoxGeometry;
  private flowpacketMaterial: THREE.MeshStandardMaterial;
  private flowlineMaterial: THREE.LineBasicMaterial;

  constructor(scene: THREE.Scene) {
    this.parentScene = scene;

    this.earth = new Earth(scene, EARTH_RADIUS, new THREE.Vector3(0, 0, 0));
    scene.add(this.earth.mesh);

    this.flowPacketWS = new FlowPacketWebSocket();
    this.flowWorker = new FlowWorker();

    // パケットのgeometryとmaterialの生成
    this.flowpacketGeometry = new THREE.BoxGeometry(.05, .05, .05);
    this.flowpacketMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
    });

    // 軌道ラインのmaterialの生成
    this.flowlineMaterial = new THREE.LineBasicMaterial({
      linewidth: 50,
      color: 0xffff00,
      linecap: 'round',
      linejoin: 'round',
    });

    // const flow = new Flow(
    //   this.flowPacketNum,
    //   this.parentScene,
    //   this.flowWorker,
    //   { lat: 0, lng: 0 },
    //   PACKET_GOAL,
    //   EARTH_RADIUS,
    //   4,
    //   4,
    //   (packet) => {
    //     this.flowPacketList.push(packet);
    //   },
    //   (packet) => {
    //     this.flowPacketList.splice(this.flowPacketList.indexOf(packet), 1);
    //   }
    // );
    // this.flowPacketNum += 1;
    // flow.create();
    
    // setInterval(() => {
    //   console.log(this.flowPacketList);
    // }, 1000);
  }

  public update() {
    if (this.flowPacketWS.getIsNewFlowPacketList()) {
      const flowPacketList = this.flowPacketWS.getFlowPacketList().slice(0, GET_PACKET_LIMIT);
      flowPacketList.map((flowPacket) => {
        const now = this.flowPacketNum;
        this.flowPacketNum += 1;
        const flow = new Flow(
          now, // id
          this.parentScene, // scene
          this.flowWorker, // flowWorker
          this.flowpacketGeometry, // packetGeometry
          this.flowpacketMaterial, // packetMaterial
          this.flowlineMaterial, // lineMaterial
          flowPacket.from, // start
          PACKET_GOAL, // goal
          EARTH_RADIUS, // radius
          PACKET_ORBIT_HEIGHT, // height
          PACKET_GOAL_TIME, // duration
          (packet) => {
            this.flowPacketList.push(packet);
          }, // onCreate
          (packet) => {
            this.flowPacketList.splice(this.flowPacketList.indexOf(packet), 1);
          }, // onGoal
        );
        flow.create();
      });
    }

    this.flowPacketList.map((flowPacket) => {
      flowPacket.update();
    });

  }

}
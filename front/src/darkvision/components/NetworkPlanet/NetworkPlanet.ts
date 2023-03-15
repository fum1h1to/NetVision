import * as THREE from 'three';
import { DEFAULT_PACKET_COLOR, EARTH_RADIUS, GET_PACKET_LIMIT, PACKET_GOAL, PACKET_GOAL_TIME, PACKET_ORBIT_HEIGHT } from '../../constant';
import { PacketData } from '../../models/PacketData';
import { FlowPacketWebSocket } from '../../websocket/FlowPacketWebSocket';
import { Earth } from '../Earth/Earth';
import { Flow } from '../Flow/Flow';
import FlowWorker from "../Flow/worker/FlowWorker?worker";
import { FlowCounterManager } from '../FlowCounterManager/FlowCounterManager';

export class NetworkPlanet {
  private parentScene: THREE.Scene;
  private flowPacketWS: FlowPacketWebSocket;
  private animateFlowPacketList: Flow[] = [];
  private flowPacketNum: number = 0;
  private earth: Earth;
  private flowWorker: Worker;
  private flowCounterManager: FlowCounterManager;

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
      color: DEFAULT_PACKET_COLOR,
    });

    // 軌道ラインのmaterialの生成
    this.flowlineMaterial = new THREE.LineBasicMaterial({
      linewidth: 50,
      color: DEFAULT_PACKET_COLOR,
      linecap: 'round',
      linejoin: 'round',
    });

    this.flowCounterManager = new FlowCounterManager(
      scene,
      EARTH_RADIUS
    );
    
    // setInterval(() => {
    //   console.log(this.flowPacketList);
    // }, 1000);
  }

  private createFlow(packetData: PacketData) {
    const now = this.flowPacketNum;
    this.flowPacketNum += 1;
    const flow = new Flow(
      now, // id
      this.parentScene, // scene
      this.flowWorker, // flowWorker
      this.flowpacketGeometry, // packetGeometry
      this.flowpacketMaterial, // packetMaterial
      this.flowlineMaterial, // lineMaterial
      packetData.from, // start
      PACKET_GOAL, // goal
      EARTH_RADIUS, // radius
      PACKET_ORBIT_HEIGHT, // height
      PACKET_GOAL_TIME, // duration
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
    if (this.flowPacketWS.getIsNewFlowPacketList()) {
      const activeFlowPacketList = this.flowPacketWS.getFlowPacketList().slice(0, GET_PACKET_LIMIT);
      activeFlowPacketList.map((flowPacket) => {
        this.createFlow(flowPacket);
      });
    }

    this.animateFlowPacketList.map((flowPacket) => {
      flowPacket.update();
    });

  }

}
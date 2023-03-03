import * as THREE from 'three';
import { RADIUS } from '../../constant';
import { LatLng } from '../../models/LatLng';
import { FlowPacketWebSocket } from '../../websocket/FlowPacketWebSocket';
import { Earth } from '../Earth/Earth';

export class NetworkPlanet {
  private readonly GOAL: LatLng = { lat: 35, lng: 140 };
  private flowPacketWS: FlowPacketWebSocket;
  private earth: Earth;

  constructor(scene: THREE.Scene) {
    this.earth = new Earth(scene, RADIUS, new THREE.Vector3(0, 0, 0));

    scene.add(this.earth.mesh);

    this.flowPacketWS = new FlowPacketWebSocket();
  }

  public update() {
    if (this.flowPacketWS.getIsNewFlowPacketList()) {
      console.log(this.flowPacketWS.getFlowPacketList());
    }
  }

}
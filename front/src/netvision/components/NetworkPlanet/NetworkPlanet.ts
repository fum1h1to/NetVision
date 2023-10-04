import * as THREE from 'three';
import { Earth } from '../Earth/Earth';
import { FlowManager } from '../FlowManager/FlowManager';

export class NetworkPlanet {
  // private parentScene: THREE.Scene;
  private earth: Earth;
  private flowManager: FlowManager;

  constructor(scene: THREE.Scene) {
    // this.parentScene = scene;

    this.earth = new Earth(scene, globalThis.constantManager.getEARTH_RADIUS(), new THREE.Vector3(0, 0, 0));
    scene.add(this.earth.mesh);

    this.flowManager = new FlowManager(scene);
  }

  public init() {
    this.flowManager.init();
  }

  public update() {
    this.flowManager.update();

  }

}
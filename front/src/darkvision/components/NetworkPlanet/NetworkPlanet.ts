import * as THREE from 'three';
import { LatLng } from '../../../models/LatLng';
import { Earth } from '../Earth/Earth';

export class NetworkPlanet {
  private RADIUS: number = 8;
  private GOAL: LatLng = { lat: 35, lng: 140 };
  private earth: Earth;

  constructor(scene: THREE.Scene) {
    this.earth = new Earth(scene, this.RADIUS, new THREE.Vector3(0, 0, 0));

    scene.add(this.earth.mesh)
  }

  public update() {
    
  }

}
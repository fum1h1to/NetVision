import * as THREE from 'three';
import { latlng2Cartesian } from '../../../assets/ts/util/coordinates';
import { easeOutQuart } from '../../../assets/ts/util/easing';
import { remap } from '../../../assets/ts/util/remap';
import { LatLng } from '../../models/LatLng';

export class Flow {
  private sceneParent: THREE.Scene;
  private packetGeometry: THREE.SphereGeometry;
  private packetMaterial: THREE.MeshStandardMaterial;
  public packetMesh: THREE.Mesh;
  private lineGeometry: THREE.BufferGeometry;
  private lineMaterial: THREE.LineBasicMaterial;
  public lineMesh: THREE.Line;
  private aliveTime: number;
  private currentTime: number;
  private orbitPoints: THREE.Vector3[];
  private onEnd: () => void;

  constructor(
    scene: THREE.Scene,
    start: LatLng, 
    goal: LatLng,
    radius: number, 
    height: number,
    duration: number,
    onEnd: () => void,
  ) {
    this.sceneParent = scene;
    this.currentTime = 0;
    this.aliveTime = duration * 60;
    this.onEnd = onEnd;

    // 軌道の座標の計算
    const startCartesian = latlng2Cartesian(radius, start.lat, start.lng);
    const goalCartesian = latlng2Cartesian(radius, goal.lat, goal.lng);
    this.orbitPoints = this.createOrbitPoints(startCartesian, goalCartesian, height, this.aliveTime);

    // パケットの生成
    this.packetGeometry = new THREE.SphereGeometry(.05, 32, 32);
    this.packetMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
    });
    this.packetMesh = new THREE.Mesh(this.packetGeometry, this.packetMaterial);
    this.packetMesh.position.set(startCartesian.x, startCartesian.y, startCartesian.z);

    // 軌道ラインの生成
    this.lineGeometry = new THREE.BufferGeometry().setFromPoints(this.orbitPoints);
    this.lineMaterial = new THREE.LineBasicMaterial({
      linewidth: 50,
      color: 0xffff00,
      linecap: 'round',
      linejoin: 'round',
    });
    this.lineMesh = new THREE.Line(this.lineGeometry, this.lineMaterial);

    // scene.add(this.packetMesh);
    // scene.add(this.lineMesh);
  }

  private createOrbitPoints(startPoint: THREE.Vector3, endPoint: THREE.Vector3, height: number, segmentNum: number ): THREE.Vector3[] {
    const points: THREE.Vector3[] = [];
    const startVec = startPoint.clone();
    const endVec = endPoint.clone();
    
    const axis = startVec.clone().cross(endVec);
    axis.normalize();
    const angle = startVec.angleTo(endVec);
  
    const twoSegmentNum = segmentNum / 2;
  
    for (let i = 0; i < segmentNum - 1; i++) {
  
      const q = new THREE.Quaternion();
      q.setFromAxisAngle(axis, angle / segmentNum * i);
  
      let heightValue: number;
      if (i < twoSegmentNum) {
        let v = remap(i, 0, twoSegmentNum, 0, 1);
        heightValue = height * easeOutQuart(v);
      } else {
        let v = remap(i, twoSegmentNum, segmentNum, 1, 0);
        heightValue = height * easeOutQuart(v);
      }
  
      const vertex = startVec.clone().multiplyScalar(1 + (heightValue / 50)).applyQuaternion(q);
      points.push(vertex);
    }
  
    points.push(endPoint);
  
    return points;
  }

  public sceneAdd () {
    this.sceneParent.add(this.packetMesh);
    this.sceneParent.add(this.lineMesh);
  }

  public update() {
    if (this.currentTime < this.aliveTime) {
      const point = this.orbitPoints[this.currentTime];
      this.packetMesh.position.set(point.x, point.y, point.z);

      this.currentTime += 1;

    } else {
      this.sceneParent.remove(this.packetMesh);
      this.sceneParent.remove(this.lineMesh);
      this.onEnd();
    }
  }

}
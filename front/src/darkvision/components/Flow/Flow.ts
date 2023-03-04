import * as THREE from 'three';
import FlowWorker from "./worker/createOrbitPoints?worker";
import { FlowWorkerInput } from '../../models/FlowWorkerModel';
import { LatLng } from '../../models/LatLng';

export class Flow {
  private id: number;
  private radius: number;
  private start: LatLng;
  private goal: LatLng;
  private height: number;
  private sceneParent: THREE.Scene;
  private packetMesh: THREE.Mesh;
  private lineMesh: THREE.Line;
  private aliveTime: number;
  private currentTime: number;
  private orbitPoints: THREE.Vector3[];

  constructor(
    id: number,
    scene: THREE.Scene,
    start: LatLng, 
    goal: LatLng,
    radius: number, 
    height: number,
    duration: number,
  ) {
    this.id = id;
    this.sceneParent = scene;
    this.start = start;
    this.goal = goal;
    this.radius = radius;
    this.height = height;
    this.currentTime = 0;
    this.aliveTime = duration * 60;
  }

  public create() {
    const worker = new FlowWorker();

    worker.addEventListener('message', (event) => {
      worker.terminate();

      const { orbitPoints } = event.data;
      this.orbitPoints = orbitPoints;

      // パケットの生成
      const packetGeometry = new THREE.SphereGeometry(.05, 2, 2);
      const packetMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
      });
      this.packetMesh = new THREE.Mesh(packetGeometry, packetMaterial);

      // 軌道ラインの生成
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(this.orbitPoints);
      const lineMaterial = new THREE.LineBasicMaterial({
        linewidth: 50,
        color: 0xffff00,
        linecap: 'round',
        linejoin: 'round',
      });
      this.lineMesh = new THREE.Line(lineGeometry, lineMaterial);

      
      this.sceneParent.add(this.packetMesh);
      this.sceneParent.add(this.lineMesh);

      this.update();

    }, {once: true});
    
    const workerPostMesage: FlowWorkerInput = {
      radius: this.radius,
      start: this.start,
      goal: this.goal,
      height: this.height,
      aliveTime: this.aliveTime,
    }
    worker.postMessage(workerPostMesage);
  }

  public update() {
    if (this.currentTime < this.aliveTime) {
      const point = this.orbitPoints[this.currentTime];
      this.packetMesh.position.set(point.x, point.y, point.z);

      this.currentTime += 1;
      
      requestAnimationFrame(() => this.update());
    } else {
      this.sceneParent.remove(this.packetMesh);
      this.sceneParent.remove(this.lineMesh);

    }
  }

  public getID() {
    return this.id;
  }

}
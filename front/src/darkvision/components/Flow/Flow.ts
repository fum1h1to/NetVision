import * as THREE from 'three';
import { FlowWorkerInput } from '../../models/FlowWorkerModel';
import { LatLng } from '../../models/LatLng';

export class Flow {
  private id: number;
  private radius: number;
  private start: LatLng;
  private goal: LatLng;
  private height: number;
  private sceneParent: THREE.Scene;
  private packetList: Flow[] = [];
  private flowWorker: Worker;
  private packetMesh: THREE.Mesh;
  private lineMesh: THREE.Line;
  private aliveTime: number;
  private currentTime: number;
  private orbitPoints: THREE.Vector3[];

  constructor(
    id: number,
    scene: THREE.Scene,
    packetList: Flow[],
    flowWorker: Worker,
    start: LatLng, 
    goal: LatLng,
    radius: number, 
    height: number,
    duration: number,
  ) {
    this.id = id;
    this.sceneParent = scene;
    this.packetList = packetList;
    this.flowWorker = flowWorker;
    this.start = start;
    this.goal = goal;
    this.radius = radius;
    this.height = height;
    this.currentTime = 0;
    this.aliveTime = duration * 60;
  }

  public create() {

    this.flowWorker.addEventListener('message', (event) => {
      const { id, orbitPoints } = event.data;
      if (id !== this.id) return;

      this.orbitPoints = orbitPoints;

      // パケットの生成
      const packetGeometry = new THREE.BoxGeometry(.05, .05, .05);
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

      this.packetList.push(this);

    });
    
    const workerPostMesage: FlowWorkerInput = {
      id: this.id,
      radius: this.radius,
      start: this.start,
      goal: this.goal,
      height: this.height,
      aliveTime: this.aliveTime,
    }
    this.flowWorker.postMessage(workerPostMesage);
  }

  public update() {
    if (this.currentTime < this.aliveTime) {
      const point = this.orbitPoints[this.currentTime];
      this.packetMesh.position.set(point.x, point.y, point.z);

      this.currentTime += 1;
      
    } else {
      this.sceneParent.remove(this.packetMesh);
      this.sceneParent.remove(this.lineMesh);

      this.packetList.splice(this.packetList.indexOf(this), 1)

    }
  }

  public getID() {
    return this.id;
  }

}
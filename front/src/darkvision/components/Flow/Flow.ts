import * as THREE from 'three';
import { MAX_FPS } from '../../constant';
import { FlowWorkerInput } from '../../models/FlowWorkerModel';
import { LatLng } from '../../models/LatLng';

export class Flow {
  private id: number;
  private radius: number;
  private start: LatLng;
  private goal: LatLng;
  private height: number;
  private addTo: THREE.Scene;
  private flowWorker: Worker;
  private packetMesh: THREE.Mesh;
  private lineMesh: THREE.Line;
  private aliveTime: number;
  private currentTime: number;
  private orbitPoints: THREE.Vector3[];
  private isCreated: boolean = false;
  private onCreate: (packet: Flow) => void;
  private onGoal: (packet: Flow) => void;

  constructor(
    id: number,
    scene: THREE.Scene,
    flowWorker: Worker,
    start: LatLng, 
    goal: LatLng,
    radius: number, 
    height: number,
    duration: number,
    onCreate: (packet: Flow) => void,
    onGoal: (packet: Flow) => void,
  ) {
    this.id = id;
    this.addTo = scene;
    this.flowWorker = flowWorker;
    this.start = start;
    this.goal = goal;
    this.radius = radius;
    this.height = height;
    this.currentTime = 0;
    this.aliveTime = duration * MAX_FPS;
    this.onCreate = onCreate;
    this.onGoal = onGoal;
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

      
      this.addTo.add(this.packetMesh);
      this.addTo.add(this.lineMesh);

      this.isCreated = true;
      this.onCreate(this);

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
    if (this.isCreated) {
      if (this.currentTime < this.aliveTime) {
        const point = this.orbitPoints[this.currentTime];
        this.packetMesh.position.set(point.x, point.y, point.z);
  
        this.currentTime += 1;
        
      } else {
        this.addTo.remove(this.packetMesh);
        this.addTo.remove(this.lineMesh);

        this.onGoal(this);
      }
    }
  }
}
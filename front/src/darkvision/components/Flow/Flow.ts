import * as THREE from 'three';
import { remap } from '../../../assets/ts/util/remap';
import { ABUSEIPDB_IP_COLOR, MAX_FPS, MAX_PACKET_SCALE, MAX_SCALE_PACKET_COUNT, THRESHOLD_ABUSEIPDB_CONFIDENCE_SCORE } from '../../constant';
import { FlowWorkerInput } from '../../models/FlowWorkerModel';
import { LatLng } from '../../models/LatLng';
import { PacketData } from '../../models/PacketData';

export class Flow {
  private id: number;
  private radius: number;
  private start: LatLng;
  private goal: LatLng;
  private height: number;
  private addTo: THREE.Scene;
  private flowWorker: Worker;
  private packetGeometry: THREE.BoxGeometry;
  private packetMaterial: THREE.MeshStandardMaterial;
  private packetMesh: THREE.Mesh;
  private lineMaterial: THREE.LineBasicMaterial;
  private lineMesh: THREE.Line;
  private aliveTime: number;
  private currentTime: number;
  private orbitPoints: THREE.Vector3[];
  private isCreated: boolean = false;
  private packetData: PacketData;
  private onCreate: (packet: Flow) => void;
  private onGoal: (packet: Flow) => void;

  constructor(
    id: number,
    scene: THREE.Scene,
    flowWorker: Worker,
    packetGeometry: THREE.BoxGeometry,
    packetMaterial: THREE.MeshStandardMaterial,
    lineMaterial: THREE.LineBasicMaterial,
    start: LatLng, 
    goal: LatLng,
    radius: number, 
    height: number,
    duration: number,
    packetData: PacketData,
    onCreate: (packet: Flow) => void,
    onGoal: (packet: Flow) => void,
  ) {
    this.id = id;
    this.addTo = scene;
    this.flowWorker = flowWorker;
    this.packetGeometry = packetGeometry;
    this.packetMaterial = packetMaterial;
    this.lineMaterial = lineMaterial;
    this.start = start;
    this.goal = goal;
    this.radius = radius;
    this.height = height;
    this.currentTime = 0;
    this.aliveTime = duration * MAX_FPS;
    this.packetData = packetData;
    this.onCreate = onCreate;
    this.onGoal = onGoal;
  }

  private onMessage = (event: MessageEvent) => {
    const { id, orbitPoints } = event.data;
    if (id !== this.id) return;

    this.orbitPoints = orbitPoints;

    // パケットの生成
    this.packetMesh = new THREE.Mesh(this.packetGeometry, this.packetMaterial);
    const packetCount = this.packetData.packetCount < MAX_SCALE_PACKET_COUNT ? this.packetData.packetCount : MAX_SCALE_PACKET_COUNT;
    const scaleSize = remap(packetCount, 1, MAX_SCALE_PACKET_COUNT, 1, MAX_PACKET_SCALE);
    this.packetMesh.scale.set(scaleSize, scaleSize, scaleSize);
    if (this.packetData.abuseIPScore >= THRESHOLD_ABUSEIPDB_CONFIDENCE_SCORE) {
      // @ts-ignore
      (this.packetMesh.material as THREE.Material).color.setHex(ABUSEIPDB_IP_COLOR);
    }

    // 軌道ラインの生成
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(this.orbitPoints);
    this.lineMesh = new THREE.Line(lineGeometry, this.lineMaterial);
    if (this.packetData.abuseIPScore >= THRESHOLD_ABUSEIPDB_CONFIDENCE_SCORE) {
      // @ts-ignore
      (this.lineMesh.material as THREE.Material).color.setHex(ABUSEIPDB_IP_COLOR);
    }
    
    this.addTo.add(this.packetMesh);
    this.addTo.add(this.lineMesh);

    this.isCreated = true;
    this.onCreate(this);
  }

  public create() {
    this.flowWorker.addEventListener('message', this.onMessage);
    
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
        this.remove();

        this.onGoal(this);
      }
    }
  }

  private remove() {
    this.flowWorker.removeEventListener('message', this.onMessage);

    this.addTo.remove(this.packetMesh);
    this.addTo.remove(this.lineMesh);

    (this.packetMesh.material as THREE.Material).dispose();
    this.packetMesh.geometry.dispose();

    (this.lineMesh.material as THREE.Material).dispose();
    this.lineMesh.geometry.dispose();
  }

  public getLatLngAndPacketCount(): LatLng {
    return this.start;
  }

  public getPacketCount(): number { 
    return this.packetData.packetCount
  }

  public getIp(): string {
    return this.packetData.srcip;
  }
}
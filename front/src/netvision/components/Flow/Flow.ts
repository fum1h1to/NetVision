import * as THREE from 'three';
import { remap } from '../../util/remap';
import { LatLng } from '../../models/LatLng';
import { PacketData } from '../../models/PacketData';
import { easeOutQuart } from '../../util/easing';
import { latlng2Cartesian } from '../../util/coordinates';

export class Flow {
  private id: number;
  private radius: number;
  private start: LatLng;
  private goal: LatLng;
  private height: number;
  private addTo: THREE.Scene;
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
    this.packetGeometry = packetGeometry;
    this.packetMaterial = packetMaterial.clone();
    this.lineMaterial = lineMaterial.clone();
    this.start = start;
    this.goal = goal;
    this.radius = radius;
    this.height = height;
    this.currentTime = 0;
    this.aliveTime = duration * globalThis.constantManager.getMAX_FPS();
    this.packetData = packetData;
    this.onCreate = onCreate;
    this.onGoal = onGoal;
  }

  public createOrbitPoints(startPoint: THREE.Vector3, endPoint: THREE.Vector3, height: number, segmentNum: number) {
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

  public create() {

    const startCartesian = latlng2Cartesian(this.radius, this.start.lat, this.start.lng);
    const goalCartesian = latlng2Cartesian(this.radius, this.goal.lat, this.goal.lng);
    this.orbitPoints = this.createOrbitPoints(startCartesian, goalCartesian, this.height, this.aliveTime);

    // パケットの生成
    this.packetMesh = new THREE.Mesh(this.packetGeometry, this.packetMaterial);
    const packetCount = this.packetData.packetCount < globalThis.constantManager.getMAX_SCALE_PACKET_COUNT() ? this.packetData.packetCount : globalThis.constantManager.getMAX_SCALE_PACKET_COUNT();
    const scaleSize = remap(packetCount, 1, globalThis.constantManager.getMAX_SCALE_PACKET_COUNT(), 1, globalThis.constantManager.getMAX_PACKET_SCALE());
    this.packetMesh.scale.set(scaleSize, scaleSize, scaleSize);
    if (this.packetData.isSpamhausContain) {
      // @ts-ignore
      (this.packetMesh.material as THREE.Material).color.setHex(globalThis.constantManager.getSPAMHAUS_IP_COLOR());
    }
    if (this.packetData.isBlocklistDeContain) {
      // @ts-ignore
      (this.packetMesh.material as THREE.Material).color.setHex(globalThis.constantManager.getBLOCKLIST_DE_IP_COLOR());
    }
    if (this.packetData.abuseIPScore >= globalThis.constantManager.getTHRESHOLD_ABUSEIPDB_CONFIDENCE_SCORE()) {
      // @ts-ignore
      (this.packetMesh.material as THREE.Material).color.setHex(globalThis.constantManager.getABUSEIPDB_IP_COLOR());
    }

    // 軌道ラインの生成
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(this.orbitPoints);
    this.lineMesh = new THREE.Line(lineGeometry, this.lineMaterial);
    if (this.packetData.isSpamhausContain) {
      // @ts-ignore
      (this.lineMesh.material as THREE.Material).color.setHex(globalThis.constantManager.getSPAMHAUS_IP_COLOR());
    }
    if (this.packetData.isBlocklistDeContain) {
      // @ts-ignore
      (this.lineMesh.material as THREE.Material).color.setHex(globalThis.constantManager.getBLOCKLIST_DE_IP_COLOR());
    }
    if (this.packetData.abuseIPScore >= globalThis.constantManager.getTHRESHOLD_ABUSEIPDB_CONFIDENCE_SCORE()) {
      // @ts-ignore
      (this.lineMesh.material as THREE.Material).color.setHex(globalThis.constantManager.getABUSEIPDB_IP_COLOR());
    }
    
    this.addTo.add(this.packetMesh);
    this.addTo.add(this.lineMesh);

    this.isCreated = true;
    this.onCreate(this);
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
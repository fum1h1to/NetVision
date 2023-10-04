import * as THREE from 'three';
import { remap } from '../../util/remap';
import { LatLng } from '../../models/LatLng';
import { PacketData } from '../../models/PacketData';
import { easeOutQuart } from '../../util/easing';
import { latlng2Cartesian } from '../../util/coordinates';
import { FlowModelManager } from './FlowModelManager';

export class Flow {
  private LINE_SEGMENT_NUM: number = 20;

  private id: number;
  private radius: number;
  private start: LatLng;
  private startCartesian: THREE.Vector3;
  private goal: LatLng;
  private goalCartesian: THREE.Vector3;
  private height: number;
  private parentScene: THREE.Scene;
  private flowModelManager: FlowModelManager;
  private packetGroup: THREE.Group;
  private lineMesh: THREE.Line;
  private aliveTime: number;
  private currentTime: number;
  private isCreated: boolean = false;
  private packetData: PacketData;
  private onCreate: (packet: Flow) => void;
  private onGoal: (packet: Flow) => void;

  private o_startVec: THREE.Vector3;
  private o_endVec: THREE.Vector3;
  private o_axis: THREE.Vector3;
  private o_angle: number;

  constructor(
    id: number,
    scene: THREE.Scene,
    flowModelManager: FlowModelManager,
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
    this.parentScene = scene;
    this.flowModelManager = flowModelManager;
    this.start = start;
    this.goal = goal;
    this.radius = radius;
    this.height = height;
    this.currentTime = 0;
    this.aliveTime = duration
    this.packetData = packetData;
    this.onCreate = onCreate;
    this.onGoal = onGoal;

    this.startCartesian = latlng2Cartesian(this.radius, this.start.lat, this.start.lng);
    this.goalCartesian = latlng2Cartesian(this.radius, this.goal.lat, this.goal.lng);
    this.o_startVec = this.startCartesian.clone();
    this.o_endVec = this.goalCartesian.clone();
    this.o_axis = this.o_startVec.clone().cross(this.o_endVec);
    this.o_axis.normalize();
    this.o_angle = this.o_startVec.angleTo(this.o_endVec);
  }

  public createOrbitPoints(segmentNum: number) {
    const points: THREE.Vector3[] = [];
    const devideSegmentNum = segmentNum / 2;

    for (let i = 0; i < segmentNum - 1; i++) {

      const q = new THREE.Quaternion();
      q.setFromAxisAngle(this.o_axis, this.o_angle / segmentNum * i);

      let heightValue: number;
      if (i < devideSegmentNum) {
        let v = remap(i, 0, devideSegmentNum, 0, 1);
        heightValue = this.height * easeOutQuart(v);
      } else {
        let v = remap(i, devideSegmentNum, segmentNum, 1, 0);
        heightValue = this.height * easeOutQuart(v);
      }

      const vertex = this.o_startVec.clone().multiplyScalar(1 + (heightValue / 50)).applyQuaternion(q);
      points.push(vertex);
    }

    points.push(this.goalCartesian);
    return points;
  }

  private createDefaultPacket(type: "normal" | "abuseipdb" | "spamhaus" | "blocklistde") {
    // 3dモデルが設定されていないときのパケットの生成
    const packetMesh = new THREE.Mesh(this.flowModelManager.getPacketGeometry(), this.flowModelManager.getPacketMaterial());

    if (type === "abuseipdb") {
      // @ts-ignore
      (packetMesh.material as THREE.Material).color.setHex(globalThis.constantManager.getABUSEIPDB_IP_COLOR());
    } else if (type === "spamhaus") {
      // @ts-ignore
      (packetMesh.material as THREE.Material).color.setHex(globalThis.constantManager.getSPAMHAUS_IP_COLOR());
    } else if (type === "blocklistde") {
      // @ts-ignore
      (packetMesh.material as THREE.Material).color.setHex(globalThis.constantManager.getBLOCKLIST_DE_IP_COLOR());
    }

    return packetMesh;

  }

  public create() {

    this.startCartesian = latlng2Cartesian(this.radius, this.start.lat, this.start.lng);
    this.goalCartesian = latlng2Cartesian(this.radius, this.goal.lat, this.goal.lng);
    const orbitPointsLine = this.createOrbitPoints(this.LINE_SEGMENT_NUM);

    if (this.packetData.abuseIPScore >= globalThis.constantManager.getTHRESHOLD_ABUSEIPDB_CONFIDENCE_SCORE()) {
      const model = this.flowModelManager.getAbuseIPDBPacketGroup()
      if (model) {
        this.packetGroup = model;
      } else {
        this.packetGroup = new THREE.Group().add(this.createDefaultPacket("abuseipdb"));
      }
    } else if (this.packetData.isBlocklistDeContain) {
      const model = this.flowModelManager.getBlocklistDePacketGroup()
      if (model) {
        this.packetGroup = model;
      } else {
        this.packetGroup = new THREE.Group().add(this.createDefaultPacket("blocklistde"));
      }
    } else if (this.packetData.isSpamhausContain) {
      const model = this.flowModelManager.getSpamhausPacketGroup()
      if (model) {
        this.packetGroup = model;
      } else {
        this.packetGroup = new THREE.Group().add(this.createDefaultPacket("spamhaus"));
      }
    } else {
      const model = this.flowModelManager.getNormalPacketGroup()
      if (model) {
        this.packetGroup = model;
      } else {
        this.packetGroup = new THREE.Group().add(this.createDefaultPacket("normal"));
      }
    }

    const packetCount = this.packetData.packetCount < globalThis.constantManager.getMAX_SCALE_PACKET_COUNT() ? this.packetData.packetCount : globalThis.constantManager.getMAX_SCALE_PACKET_COUNT();
    const scaleSize = remap(packetCount, 1, globalThis.constantManager.getMAX_SCALE_PACKET_COUNT(), 1, globalThis.constantManager.getMAX_PACKET_SCALE());
    this.packetGroup.scale.multiplyScalar(scaleSize);

    // 軌道ラインの生成
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(orbitPointsLine);
    this.lineMesh = new THREE.Line(lineGeometry, this.flowModelManager.getLineMaterial());
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

    this.parentScene.add(this.packetGroup);
    this.parentScene.add(this.lineMesh);

    this.isCreated = true;
    this.onCreate(this);
  }

  public getNowPoint(currentTime: number): THREE.Vector3 {
    const segmentNum = 100;
    const devideSegmentNum = segmentNum / 2;
    const currentTimeSeg = remap(currentTime, 0, this.aliveTime, 0, segmentNum);

    const q = new THREE.Quaternion();
    q.setFromAxisAngle(this.o_axis, this.o_angle / segmentNum * currentTimeSeg);

    let heightValue: number;
    if (currentTimeSeg < devideSegmentNum) {
      let v = remap(currentTimeSeg, 0, devideSegmentNum, 0, 1);
      heightValue = this.height * easeOutQuart(v);
    } else {
      let v = remap(currentTimeSeg, devideSegmentNum, segmentNum, 1, 0);
      heightValue = this.height * easeOutQuart(v);
    }

    const vertex = this.o_startVec.clone().multiplyScalar(1 + (heightValue / 50)).applyQuaternion(q);
    return vertex;
  }

  public update() {
    if (this.isCreated) {
      if (this.currentTime < this.aliveTime) {
        const point = this.getNowPoint(this.currentTime);
        
        // 地球の垂線方向が上になるようにする
        const direction = new THREE.Vector3().copy(point).normalize();
        this.packetGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

        // 目的地に進行方向が向くようにする
        const pointDir = new THREE.Vector3().copy(point).normalize();
        const endDir = new THREE.Vector3().copy(this.o_endVec).normalize();

        const pointQuaternion = new THREE.Quaternion();
        pointQuaternion.setFromUnitVectors(pointDir, new THREE.Vector3(0, 1, 0));

        endDir.applyQuaternion(pointQuaternion);

        const angle = Math.atan2(endDir.x, endDir.z);

        this.packetGroup.rotateOnWorldAxis(direction, angle - Math.PI / 2);

        // パケットの位置を更新
        this.packetGroup.position.set(point.x, point.y, point.z);

        this.currentTime += globalThis.constantManager.getDelta();

      } else {
        this.remove();

        this.onGoal(this);
      }
    }
  }

  private remove() {

    this.packetGroup.removeFromParent();
    this.parentScene.remove(this.lineMesh);

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

  public getId(): number {
    return this.id;
  }
}
import { LatLng } from "./LatLng";

export type FlowWorkerInput = {
  radius: number;
  start: LatLng;
  goal: LatLng;
  height: number;
  aliveTime: number;
}

export type FlowWorkerOutput = {
  orbitPoints: THREE.Vector3[];
}
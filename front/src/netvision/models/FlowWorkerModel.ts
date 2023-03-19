import { LatLng } from "./LatLng";

export type FlowWorkerInput = {
  id: number;
  radius: number;
  start: LatLng;
  goal: LatLng;
  height: number;
  aliveTime: number;
}

export type FlowWorkerOutput = {
  id: number;
  orbitPoints: THREE.Vector3[];
}
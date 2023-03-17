import * as THREE from 'three';
import { latlng2Cartesian } from '../../../util/coordinates';
import { easeOutQuart } from '../../../util/easing';
import { remap } from '../../../util/remap';
import { FlowWorkerOutput } from '../../../models/FlowWorkerModel';
import { LatLng } from '../../../models/LatLng';

export const createOrbitPoints = (id: number, radius: number, start: LatLng, goal: LatLng, height: number, aliveTime: number): FlowWorkerOutput => {
  
  const createOrbitPoints = (startPoint: THREE.Vector3, endPoint: THREE.Vector3, height: number, segmentNum: number): THREE.Vector3[] => {
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

  const startCartesian = latlng2Cartesian(radius, start.lat, start.lng);
  const goalCartesian = latlng2Cartesian(radius, goal.lat, goal.lng);
  const orbitPoints = createOrbitPoints(startCartesian, goalCartesian, height, aliveTime);

  const output: FlowWorkerOutput = {
    id: id,
    orbitPoints: orbitPoints,
  }

  return output;
}
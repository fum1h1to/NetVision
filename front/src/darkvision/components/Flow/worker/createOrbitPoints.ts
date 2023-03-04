// @ts-ignore
const _worker: Worker = self as any;

/**
 * Flowの軌道計算を行う
 */
_worker.onmessage = async (event: MessageEvent) => {
  const THREE = await import('three');
  const { remap } = await import('../../../../assets/ts/util/remap');
  const { easeOutQuart } = await import('../../../../assets/ts/util/easing');
  const { latlng2Cartesian } = await import('../../../../assets/ts/util/coordinates');

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

  const { radius, start, goal, height, aliveTime } = event.data;

  const startCartesian = latlng2Cartesian(radius, start.lat, start.lng);
  const goalCartesian = latlng2Cartesian(radius, goal.lat, goal.lng);
  const orbitPoints = createOrbitPoints(startCartesian, goalCartesian, height, aliveTime);

  // FlowWorkerOutput型のオブジェクトを生成
  const output = {
    orbitPoints: orbitPoints,
  }

  _worker.postMessage(output);

};
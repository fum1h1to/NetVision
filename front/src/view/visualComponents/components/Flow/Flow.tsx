import * as THREE from "three";
import React, { LegacyRef, useCallback, useRef } from "react";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { latlng2Cartesian } from "../../../../util/coordinates";
import { LatLng } from "../../../../models/LatLng";
import { remap } from "../../../../util/remap";
import { easeOutQuart } from "../../../../util/easing";

const createOrbitPoints = (radius: number, startPoint: THREE.Vector3, endPoint: THREE.Vector3, height: number, segmentNum: number ): THREE.Vector3[] => {
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

const Flow = (props: {
  primary: number,
  start: LatLng,
  goal: LatLng,
  radius: number,
  height: number,
  duration: number, // s
  onEnd: () => void,
}) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const maxFrame = props.duration * 60;
  const currentFrame = useRef(0);
  
  const startCartesian = latlng2Cartesian(props.radius, props.start.lat, props.start.lng);
  const goalCartesian = latlng2Cartesian(props.radius, props.goal.lat, props.goal.lng);
  const orbitPoints = createOrbitPoints(props.radius, startCartesian, goalCartesian, props.height, maxFrame);
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints)

  const meshLine = useRef<THREE.Line>(null!);

  useFrame((state, delta) => {
    if (currentFrame.current < maxFrame) {
      const point = orbitPoints[currentFrame.current];
      mesh.current.position.set(point.x, point.y, point.z);
      currentFrame.current += 1;

    } else {
      mesh.current.visible = false;
      meshLine.current.visible = false;
      props.onEnd();
      // mesh.current.position.y += delta / 10;
    }
  });

  return (
    <group>
      <mesh
        position={startCartesian}
        ref={mesh}
      >
        <sphereGeometry args={[.05, 32, 32]} />
        <meshBasicMaterial color={0xffff00} />
      </mesh>
      {/* @ts-ignore */}
      <line ref={meshLine}
        geometry={lineGeometry}
      >
        <lineBasicMaterial attach="material" color={'#ffff00'} linewidth={50} linecap={'round'} linejoin={'round'} />
      </line>
    </group>
  );
}

export default Flow;
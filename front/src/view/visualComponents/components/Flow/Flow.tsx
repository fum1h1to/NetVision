import * as THREE from "three";
import React, { useRef } from "react";
import { ThreeElements, useFrame } from "@react-three/fiber";
import { polar2Cartesian } from "../../../../util/coordinates";

const Flow = (props: {
  primary: number,
  start: {lat: number, lng: number},
  goal: {lat: number, lng: number},
  radius: number,
  height: number,
  duration: number, // s
  onEnd: () => void,
}) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const currentMillis = useRef(0);
  
  const startCartesian = polar2Cartesian(props.radius, props.start.lat, props.start.lng);
  const goalCartesian = polar2Cartesian(props.radius, props.goal.lat, props.goal.lng);

  useFrame((state, delta) => {
    mesh.current.position.y += delta;
    if (mesh.current.position.y > 10) {
      mesh.current.visible = false;
      props.onEnd();
    }
  });

  return (
    <mesh
      position={startCartesian}
      scale={10}
      ref={mesh}
    >
      <coneGeometry args={[.025, .1, 32]} />
      <meshBasicMaterial color={0xffff00} />
    </mesh>
  );
}

export default Flow;
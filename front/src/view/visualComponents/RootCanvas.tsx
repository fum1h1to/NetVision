import React, { useEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import NetworkPlanet from "./components/NetworkPlanet/NetworkPlanet";

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(
    () => {
      const controls = new OrbitControls(camera, gl.domElement);

      controls.minDistance = 10;
      controls.maxDistance = 30;
      return () => {
        controls.dispose();
      };
    },
    [camera, gl]
  );
  return null;
};

const RootCanvas = () => {

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas flat linear>
        <CameraController />
        <ambientLight position={[0, 0, 0]} />
        <pointLight position={[10, 10, 10]} />
        <primitive object={new THREE.AxesHelper(10)} />
        <NetworkPlanet />
      </Canvas>
    </div>
  );
};

export default RootCanvas;

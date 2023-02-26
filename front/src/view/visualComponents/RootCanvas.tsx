import React, { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import Box from "./components/Box/Box";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Earth from "./components/Earth/Earth";

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(
    () => {
      const controls = new OrbitControls(camera, gl.domElement);

      controls.minDistance = 3;
      controls.maxDistance = 20;
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
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Earth position={[0, 0, 0]} scale={2.5} />
      </Canvas>
    </div>
  );
};

export default RootCanvas;

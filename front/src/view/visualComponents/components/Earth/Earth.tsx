import * as THREE from "three";
import React, { useRef } from "react";
import { ThreeElements, useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import texture from "../../../../assets/images/earth_texture_01.jpg";

const Earth = (props: ThreeElements["mesh"]) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const earthTexture = useLoader(TextureLoader, texture)!;
  
  // useFrame((state, delta) => {
  //   console.log(state.);
  //   mesh.current.rotation.x += delta;
  //   mesh.current.rotation.y += delta;
  // });

  return (
    <mesh
      {...props}
      ref={mesh}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial map={earthTexture} />
    </mesh>
  );
}

export default Earth;
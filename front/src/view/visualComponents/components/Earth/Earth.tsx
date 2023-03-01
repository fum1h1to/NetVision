import * as THREE from "three";
import React, { useRef } from "react";
import { ThreeElements, useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import texture from "../../../../assets/images/earth_texture_01.jpg";

const Earth = (props: {
  ele: ThreeElements["mesh"],
  radius: number,
}) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const earthTexture = useLoader(TextureLoader, texture)!;

  // useFrame((state, delta) => {
  //   console.log(state.);
  //   mesh.current.rotation.x += delta;
  //   mesh.current.rotation.y += delta;
  // });

  return (
    <mesh
      {...props.ele}
      ref={mesh}
    >
      <sphereGeometry args={[props.radius, 32, 32]} />
      <meshStandardMaterial map={earthTexture as THREE.Texture} />
    </mesh>
  );
}

export default Earth;
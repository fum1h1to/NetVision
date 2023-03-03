import * as THREE from 'three';
import texture from "../../../assets/images/earth_texture_03.jpg";

export class Earth {
  private radius: number;
  public mesh: THREE.Mesh;
  private geometry: THREE.SphereGeometry;
  private material: THREE.MeshStandardMaterial;

  constructor(scene: THREE.Scene, radius: number, position: THREE.Vector3) {
    this.radius = radius;

    this.geometry = new THREE.SphereGeometry(this.radius, 32, 32);
    this.material = new THREE.MeshStandardMaterial({
      map: new THREE.TextureLoader().load(texture),
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(position.x, position.y, position.z);

    scene.add(this.mesh);
  }

  public update() {
    
  }

}
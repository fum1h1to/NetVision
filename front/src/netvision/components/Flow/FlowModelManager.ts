import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class FlowModelManager {
  private d_flowpacketGeometry: THREE.BoxGeometry;
  private d_flowpacketMaterial: THREE.MeshStandardMaterial;
  private d_flowlineMaterial: THREE.LineBasicMaterial;

  private loader: GLTFLoader;
  private normalFlowModel: any;

  constructor() {
    this.loader = new GLTFLoader();
  }

  public async init() {
    // パケットのgeometryとmaterialの生成
    this.d_flowpacketGeometry = new THREE.BoxGeometry(.05, .05, .05);
    this.d_flowpacketMaterial = new THREE.MeshStandardMaterial({
      color: globalThis.constantManager.getDEFAULT_PACKET_COLOR(),
    });

    // 軌道ラインのmaterialの生成
    this.d_flowlineMaterial = new THREE.LineBasicMaterial({
      linewidth: 50,
      color: globalThis.constantManager.getDEFAULT_PACKET_COLOR(),
      linecap: 'round',
      linejoin: 'round',
    });

    await this.loadModel();
  }

  private async loadModel() {
    await this.loadNormalModel();
  }

  private async loadNormalModel() {
    this.normalFlowModel = await this.loader.loadAsync('/model3d/apple.glb');
  }

  public getPacketGeometry(): THREE.BoxGeometry {
    return this.d_flowpacketGeometry;
  }

  public getPacketMaterial(): THREE.MeshStandardMaterial {
    return this.d_flowpacketMaterial.clone();
  }

  public getLineMaterial(): THREE.LineBasicMaterial {
    return this.d_flowlineMaterial.clone();
  }

  public getNormalPacketGroup(): THREE.Group | null {
    const clone = this.normalFlowModel.scene.clone();
    if (clone) {
      // clone.traverse((node: THREE.Object3D) => {
      //   if ((node as THREE.Mesh).isMesh) {
      //     (node as THREE.Mesh).material = ((node as THREE.Mesh).material as THREE.Material).clone();
      //   }
      // });
      return clone;
    } else {
      return null;
    }
  }

  public getAbuseIPDBPacketGroup(): THREE.Group | null {
    return null;
  }

  public getBlocklistDePacketGroup(): THREE.Group | null {
    return null;
  }

  public getSpamhausPacketGroup(): THREE.Group | null {
    return null;
  }

}
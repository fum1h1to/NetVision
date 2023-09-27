import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class FlowModelManager {
  private d_flowpacketGeometry: THREE.BoxGeometry;
  private d_flowpacketMaterial: THREE.MeshStandardMaterial;
  private d_flowlineMaterial: THREE.LineBasicMaterial;

  private loader: GLTFLoader;
  private normalPacketModel: any;
  private abuseIPDBPacketModel: any;
  private spamhausPacketModel: any;
  private blocklistDePacketModel: any;

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
    await this.loadAbuseIPDBModel();
    await this.loadSpamhausModel();
    await this.loadBlocklistDeModel();
  }

  private normalizeGLTFModel(model: THREE.Group): THREE.Group {
    
    const boundingBox = new THREE.Box3().setFromObject(model);

    const boundingBoxSize = boundingBox.getSize(new THREE.Vector3());

    const maxAxis = Math.max(boundingBoxSize.x, boundingBoxSize.y, boundingBoxSize.z);
    const scale = .1 / maxAxis;

    model.scale.set(scale, scale, scale);

    return model;
  }

  private async loadNormalModel() {
    if (globalThis.constantManager.getDEFAULT_PACKET_MODEL_FILE_NAME() === "") {
      return;
    }
    this.normalPacketModel = await this.loader.loadAsync(`/models/${globalThis.constantManager.getDEFAULT_PACKET_MODEL_FILE_NAME()}`)
    .catch(() => { 
      console.log("normal model load error");
      return null; 
    });

    if (this.normalPacketModel) {

      this.normalPacketModel.scene = this.normalizeGLTFModel(this.normalPacketModel.scene.clone());
    }
  }

  private async loadAbuseIPDBModel() {
    if (globalThis.constantManager.getABUSEIPDB_IP_MODEL_FILE_NAME() === "") {
      return;
    }

    this.abuseIPDBPacketModel = await this.loader.loadAsync(`/models/${globalThis.constantManager.getABUSEIPDB_IP_MODEL_FILE_NAME()}`)
    .catch(() => {
      console.log("abuseIPDB model load error");
      return null;
    });

    if (this.abuseIPDBPacketModel) {
      this.abuseIPDBPacketModel.scene = this.normalizeGLTFModel(this.abuseIPDBPacketModel.scene.clone());
    }

  }

  private async loadSpamhausModel() {
    if (globalThis.constantManager.getSPAMHAUS_IP_MODEL_FILE_NAME() === "") {
      return;
    }

    this.spamhausPacketModel = await this.loader.loadAsync(`/models/${globalThis.constantManager.getSPAMHAUS_IP_MODEL_FILE_NAME()}`)
    .catch(() => {
      console.log("spamhaus model load error");
      return null;
    });

    if (this.spamhausPacketModel) {
      this.spamhausPacketModel.scene = this.normalizeGLTFModel(this.spamhausPacketModel.scene.clone());
    }
  }

  private async loadBlocklistDeModel() {
    if (globalThis.constantManager.getBLOCKLIST_DE_IP_MODEL_FILE_NAME() === "") {
      return;
    }

    this.blocklistDePacketModel = await this.loader.loadAsync(`/models/${globalThis.constantManager.getBLOCKLIST_DE_IP_MODEL_FILE_NAME()}`)
    .catch(() => {
      console.log("blocklist_de model load error");
      return null;
    });

    if (this.blocklistDePacketModel) {
      this.blocklistDePacketModel.scene = this.normalizeGLTFModel(this.blocklistDePacketModel.scene.clone());
    }
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
    if (!this.normalPacketModel) {
      return null;
    }

    const clone = this.normalPacketModel.scene.clone();
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
    if (!this.abuseIPDBPacketModel) {
      return null;
    }

    const clone = this.abuseIPDBPacketModel.scene.clone();
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

  public getSpamhausPacketGroup(): THREE.Group | null {
    if (!this.spamhausPacketModel) {
      return null;
    }

    const clone = this.spamhausPacketModel.scene.clone();
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

  public getBlocklistDePacketGroup(): THREE.Group | null {
    if (!this.blocklistDePacketModel) {
      return null;
    }

    const clone = this.blocklistDePacketModel.scene.clone();
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

}
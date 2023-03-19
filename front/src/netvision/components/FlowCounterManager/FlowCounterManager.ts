import * as THREE  from 'three'
import { LatLng } from '../../models/LatLng'
import { FlowCounter } from '../FlowCounter/FlowCounter';

export class FlowCounterManager {
  private parentScene: THREE.Scene;
  private radius: number;
  private flowCounterGeometry: THREE.BoxGeometry;
  private flowCounterMaterial: THREE.MeshStandardMaterial;
  private flowCountMap: Map<string, FlowCounter> = new Map<string, FlowCounter>();
  
  constructor(
    parentScene: THREE.Scene,
    radius: number
  ) {
    this.parentScene = parentScene;
    this.radius = radius;

    // flowCounterのgeometryとmaterialの生成
    this.flowCounterGeometry = new THREE.BoxGeometry(.05, .05, globalThis.constantManager.getFLOW_COUNTER_HEIGHT_RATE());
    this.flowCounterMaterial = new THREE.MeshStandardMaterial({
      color: globalThis.constantManager.getDEFAULT_FLOW_COUNTER_COLOR(),
    });
  }

  public addFlowCounter(srcip: string, latlng: LatLng, num: number) {
    const latlng_string = this.latlng2string(latlng);
    let flowCounter = this.flowCountMap.get(latlng_string);

    if (flowCounter === undefined) {
      flowCounter = new FlowCounter(this.parentScene, this.radius, num, latlng, srcip, this.flowCounterGeometry, this.flowCounterMaterial)
      flowCounter.setup();

      this.flowCountMap.set(latlng_string, flowCounter);

    } else {
      flowCounter.update(num);
    }

    this.flowCountMap.set(latlng_string, flowCounter);
  }

  private latlng2string(latlng: LatLng): string {
    return `${latlng.lat},${latlng.lng}`;
  }
}
import * as THREE  from 'three'
import { latlng2Cartesian } from '../../util/coordinates';
import { ClickableObject } from '../../global/ClickManager';
import { LatLng } from '../../models/LatLng';
import { FlowCounterDialog } from './FlowCounterDialog';

export class FlowCounter extends THREE.Mesh implements ClickableObject {
  private parentScene: THREE.Scene;
  private radius: number;
  private count: number;
  private latlng: LatLng;
  private srcip: string;

  constructor(
    parentScene: THREE.Scene, // このオブジェクトを描画するScene
    radius: number, // FlowCounterの位置を決めるための半径
    count: number, // FlowCounterの数の初期値
    latlng: LatLng, // FlowCounterの位置
    srcip: string, // srcip
    geometry: THREE.BoxGeometry,
    material: THREE.MeshStandardMaterial,
  ) {
    super(geometry, material.clone())
    this.parentScene = parentScene;
    this.radius = radius;
    this.count = count;
    this.latlng = latlng;
    this.srcip = srcip;
  }

  public onClick(camera: THREE.Camera) {
    const dialog = new FlowCounterDialog(this, camera, () => {
      this.onDialogClose();
    });

    // @ts-ignore
    this.material.color.setHex(globalThis.constantManager.getCLICKED_FLOW_COUNTER_COLOR());
    dialog.animateStart();
  }

  public onDialogClose() {
    // @ts-ignore
    this.material.color.setHex(globalThis.constantManager.getDEFAULT_FLOW_COUNTER_COLOR());
  }

  public setup() {
    const point = this.setScaleAndPosition();

    const point_normal = point.clone().normalize()
    this.up.set(point_normal.x, point_normal.y, point_normal.z)

    this.lookAt(new THREE.Vector3(0, 0, 0));

    this.parentScene.add(this);

    globalThis.clickManager.addClickableObject(this)
  }

  public update(num: number) {
    this.count += num;
    
    this.setScaleAndPosition();
  }

  private setScaleAndPosition(): THREE.Vector3 {
    let height = globalThis.constantManager.getFLOW_COUNTER_HEIGHT_RATE() * this.count;
    if (globalThis.constantManager.getFLOW_COUNTER_MAX_HEIGHT() < globalThis.constantManager.getFLOW_COUNTER_HEIGHT_RATE() * this.count) {
      height = globalThis.constantManager.getFLOW_COUNTER_MAX_HEIGHT();
      this.scale.z = globalThis.constantManager.getFLOW_COUNTER_MAX_HEIGHT() / globalThis.constantManager.getFLOW_COUNTER_HEIGHT_RATE();
      
    } else {
      this.scale.z = this.count;
    }
    const point = latlng2Cartesian(this.radius + (height / 2), this.latlng.lat, this.latlng.lng)
    this.position.set(point.x, point.y, point.z)

    return point;
  }
 
  public getSrcIP(): string {
    return this.srcip;
  }

  public getCount(): number {
    return this.count;
  }
}
import * as THREE  from 'three'
import { latlng2Cartesian } from '../../../assets/ts/util/coordinates';
import { FLOW_COUNTER_HEIGHT_RATE, FLOW_COUNTER_MAX_HEIGHT } from '../../constant';
import { ClickableObject } from '../../global/ClickManager';
import { LatLng } from '../../models/LatLng';

export class FlowCounter extends THREE.Mesh implements ClickableObject {
  private parentScene: THREE.Scene;
  private radius: number;
  private count: number;
  private latlng: LatLng;

  constructor(
    parentScene: THREE.Scene, // このオブジェクトを描画するScene
    radius: number, // FlowCounterの位置を決めるための半径
    count: number, // FlowCounterの数の初期値
    latlng: LatLng, // FlowCounterの位置
    geometry: THREE.BoxGeometry,
    material: THREE.MeshStandardMaterial,
  ) {
    super(geometry, material)
    this.parentScene = parentScene;
    this.radius = radius;
    this.count = count;
    this.latlng = latlng;
  }

  public onClick() {
    console.log('click');
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
    let height = FLOW_COUNTER_HEIGHT_RATE * this.count;
    if (FLOW_COUNTER_MAX_HEIGHT < FLOW_COUNTER_HEIGHT_RATE * this.count) {
      height = FLOW_COUNTER_MAX_HEIGHT;
      this.scale.z = FLOW_COUNTER_MAX_HEIGHT / FLOW_COUNTER_HEIGHT_RATE;
      
    } else {
      this.scale.z = this.count;
    }
    const point = latlng2Cartesian(this.radius + (height / 2), this.latlng.lat, this.latlng.lng)
    this.position.set(point.x, point.y, point.z)

    return point;
  }
 
}
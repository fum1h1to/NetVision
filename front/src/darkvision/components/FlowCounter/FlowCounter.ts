import * as THREE  from 'three'
import { latlng2Cartesian } from '../../../assets/ts/util/coordinates';
import { FLOW_COUNTER_HEIGHT_RATE, FLOW_COUNTER_MAX_HEIGHT } from '../../constant';
import { LatLng } from '../../models/LatLng';

export class FlowCounter {
  private parentScene: THREE.Scene;
  private radius: number;
  private count: number;
  private mesh: THREE.Mesh;
  private latlng: LatLng;
  private geometry: THREE.BoxGeometry;
  private material: THREE.MeshStandardMaterial;

  constructor(
    parentScene: THREE.Scene, // このオブジェクトを描画するScene
    radius: number, // FlowCounterの位置を決めるための半径
    count: number, // FlowCounterの数の初期値
    latlng: LatLng, // FlowCounterの位置
    geometry: THREE.BoxGeometry,
    material: THREE.MeshStandardMaterial,
  ) {
    this.parentScene = parentScene;
    this.radius = radius;
    this.count = count;
    this.latlng = latlng;
    this.geometry = geometry;
    this.material = material;
    this.mesh = new THREE.Mesh(this.geometry, this.material)
  }

  public setup() {
    const point = this.setScaleAndPosition();

    const point_normal = point.clone().normalize()
    this.mesh.up.set(point_normal.x, point_normal.y, point_normal.z)

    this.mesh.lookAt(new THREE.Vector3(0, 0, 0));

    this.parentScene.add(this.mesh);
  }

  public update(num: number) {
    this.count += num;
    
    this.setScaleAndPosition();
  }

  private setScaleAndPosition(): THREE.Vector3 {
    let height = FLOW_COUNTER_HEIGHT_RATE * this.count;
    if (FLOW_COUNTER_MAX_HEIGHT < FLOW_COUNTER_HEIGHT_RATE * this.count) {
      height = FLOW_COUNTER_MAX_HEIGHT;
      this.mesh.scale.z = FLOW_COUNTER_MAX_HEIGHT / FLOW_COUNTER_HEIGHT_RATE;
      
    } else {
      this.mesh.scale.z = this.count;
    }
    const point = latlng2Cartesian(this.radius + (height / 2), this.latlng.lat, this.latlng.lng)
    this.mesh.position.set(point.x, point.y, point.z)

    return point;
  }
 
}
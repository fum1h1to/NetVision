import * as THREE  from 'three'
import { latlng2Cartesian } from '../../../assets/ts/util/coordinates';
import { FLOW_COUNTER_HEIGHT_RATE, FLOW_COUNTER_MAX_HEIGHT } from '../../constant';
import { LatLng } from '../../models/LatLng'

type FlowCountData = {
  count: number;
  mesh: THREE.Mesh;
}

export class FlowCounterManager {
  private parentScene: THREE.Scene;
  private radius: number;
  private flowCounterGeometry: THREE.BoxGeometry;
  private flowCounterMaterial: THREE.MeshStandardMaterial;
  private flowCountMap: Map<string, FlowCountData> = new Map<string, FlowCountData>();
  
  constructor(
    parentScene: THREE.Scene,
    radius: number,
    flowCounterGeometry: THREE.BoxGeometry,
    flowCounterMaterial: THREE.MeshStandardMaterial,
  ) {
    this.parentScene = parentScene;
    this.radius = radius;
    this.flowCounterGeometry = flowCounterGeometry;
    this.flowCounterMaterial = flowCounterMaterial;
  }

  public addFlowCounter(latlng: LatLng, num: number) {
    const latlng_string = this.latlng2string(latlng);
    let flowCountData = this.flowCountMap.get(latlng_string);
    if (flowCountData === undefined) {
      const mesh = new THREE.Mesh(this.flowCounterGeometry, this.flowCounterMaterial)

      let height = FLOW_COUNTER_HEIGHT_RATE * num;
      if (FLOW_COUNTER_MAX_HEIGHT < FLOW_COUNTER_HEIGHT_RATE * num) {
        height = FLOW_COUNTER_MAX_HEIGHT;
        mesh.scale.z = FLOW_COUNTER_MAX_HEIGHT * FLOW_COUNTER_HEIGHT_RATE;
        
      } else {
        mesh.scale.z = num;
      }

      const point = latlng2Cartesian(this.radius + (height / 2), latlng.lat, latlng.lng)
      mesh.position.set(point.x, point.y, point.z)

      const point_normal = point.clone().normalize()
      mesh.up.set(point_normal.x, point_normal.y, point_normal.z)

      mesh.lookAt(new THREE.Vector3(0, 0, 0));

      flowCountData = {
        count: num,
        mesh: mesh,
      };
      this.parentScene.add(mesh);

    } else {
      flowCountData.count += num;
      
      let height = FLOW_COUNTER_HEIGHT_RATE * flowCountData.count;
      if (FLOW_COUNTER_MAX_HEIGHT < FLOW_COUNTER_HEIGHT_RATE * flowCountData.count) {
        height = FLOW_COUNTER_MAX_HEIGHT;
        flowCountData.mesh.scale.z = FLOW_COUNTER_MAX_HEIGHT / FLOW_COUNTER_HEIGHT_RATE;
        
      } else {
        flowCountData.mesh.scale.z = flowCountData.count;
      }
      const point = latlng2Cartesian(this.radius + (height / 2), latlng.lat, latlng.lng)
      flowCountData.mesh.position.set(point.x, point.y, point.z)
    }

    this.flowCountMap.set(latlng_string, flowCountData);
  }

  private latlng2string(latlng: LatLng): string {
    return `${latlng.lat},${latlng.lng}`;
  }
}
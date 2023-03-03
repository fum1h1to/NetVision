import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { latlng2Cartesian } from '../assets/ts/util/coordinates';
import { NetworkPlanet } from './components/NetworkPlanet/NetworkPlanet';
import { LatLng } from './models/LatLng';

export class DarkVisionWorker {
  private width: number;
  private height: number;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  // private controls: OrbitControls;
  private renderer: THREE.WebGLRenderer;
  private light: THREE.Light;
  private networkPlanet: NetworkPlanet;

  constructor(canvas: OffscreenCanvas, width: number, height: number, devicePixelRatio: number) {
    // 幅と高さの取得
    this.width = width;
    this.height = height;
    
    // @ts-ignore
    canvas.style = { width: 0, height: 0 };
    
    // レンダラーの設定
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(devicePixelRatio);

    // シーンの設定
    this.scene = new THREE.Scene();

    // カメラの設定
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height);
    const goal = { lat: 35, lng: 140 } as LatLng;
    const goal_pos = latlng2Cartesian(15, goal.lat, goal.lng);
    this.camera.position.set(goal_pos.x, goal_pos.y, goal_pos.z)
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // // カメラコントロールの設定
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.maxPolarAngle = Math.PI * 0.5;
    // this.controls.minDistance = 10;
    // this.controls.maxDistance = 30;

    // ライトの設定
    this.light = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(this.light);
  }

  public init() {
    this.networkPlanet = new NetworkPlanet(this.scene);
    const axesHelper = new THREE.AxesHelper( 10 );
    this.scene.add( axesHelper );
  }

  public resize(width: number, height: number, devicePixelRatio: number) {
    this.width = width;
    this.height = height;

    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.width, this.height);

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  public start() {
    this.update();
  }

  private update() {
    this.networkPlanet.update();

    // this.controls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.update());
  }
}
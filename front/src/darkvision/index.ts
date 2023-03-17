import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { latlng2Cartesian } from './util/coordinates';
import { NetworkPlanet } from './components/NetworkPlanet/NetworkPlanet';
import { EARTH_RADIUS, MAX_FPS, PACKET_GOAL } from './constant';
import { ClickManager } from './global/ClickManager';

import './index.css';
import { Setting } from './htmlComponents/Setting/Setting';

export class DarkVision {
  private width: number;
  private height: number;
  private rootEle: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private renderer: THREE.WebGLRenderer;
  private light: THREE.Light;
  private networkPlanet: NetworkPlanet;
  private frame: number;

  constructor(outputEle: HTMLElement) {
    this.frame = 0;
    this.rootEle = outputEle;
    globalThis.OUTPUT_ELEMENT = outputEle;

    this.rootEle.classList.add('darkVision-rootEle');
    const settingEle = new Setting().insertTo(this.rootEle);

    // 幅と高さの取得
    this.width = outputEle.clientWidth;
    this.height = outputEle.clientHeight;
    
    // レンダラーの設定
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.width, this.height);
    outputEle.appendChild(this.renderer.domElement);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // シーンの設定
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x222222);

    // カメラの設定
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height);
    const cameraPos = latlng2Cartesian(EARTH_RADIUS + 7, PACKET_GOAL.lat, PACKET_GOAL.lng);
    this.camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);

    // カメラコントロールの設定
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.maxPolarAngle = 180 * Math.PI / 180;
    this.controls.minDistance = EARTH_RADIUS + 0.1;
    this.controls.maxDistance = 30;

    // ライトの設定
    this.light = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(this.light);

    // クリックマネージャーの設定
    globalThis.clickManager = new ClickManager(outputEle, this.camera);
  }

  public init() {
    window.addEventListener('resize', () => this.resize());

    this.networkPlanet = new NetworkPlanet(this.scene);
    // const axesHelper = new THREE.AxesHelper( 10 );
    // this.scene.add( axesHelper );
  }

  private resize() {
    this.width = this.rootEle.clientWidth;
    this.height = this.rootEle.clientHeight;

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  public start() {
    this.update();
  }

  private update() {
    requestAnimationFrame(() => this.update());
    this.frame += 1;
    this.frame %= 60;
    if (this.frame % Math.floor(60 / MAX_FPS) === 1) return;
    
    clickManager.checkClickedObject();

    this.networkPlanet.update();
    
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
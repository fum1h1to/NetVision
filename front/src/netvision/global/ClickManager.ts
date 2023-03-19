import * as THREE from 'three';

export interface ClickableObject extends THREE.Object3D {
  onClick: (camera: THREE.Camera) => void;
}

// 3D空間内のオブジェクトをクリックした時の挙動
export class ClickManager {
  private container: HTMLElement;
  private camera: THREE.Camera;
  private mouse: THREE.Vector2;
  private raycaster: THREE.Raycaster;
  private clickableObjectsMap: Map<number, ClickableObject> = new Map<number, ClickableObject>();
  private noActClick: boolean;
  private clicked: boolean;

  constructor( 
    container: HTMLElement,
    camera: THREE.Camera,
  ) {
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.noActClick = false;
    this.clicked = false;

    this.container = container;
    this.camera = camera;
    this.container.addEventListener('click', this.handleClick);
  }

  private handleClick = (event: MouseEvent) => {
    const x = event.clientX - this.container.offsetLeft;
    const y = event.clientY - this.container.offsetTop;
    const w = this.container.offsetWidth;
    const h = this.container.offsetHeight;

    this.mouse.x = ( x / w ) * 2 - 1;
    this.mouse.y = -( y / h ) * 2 + 1;

    this.clicked = true;
  }

  public addClickableObject(object: ClickableObject) {
    this.clickableObjectsMap.set(object.id, object);
  }

  public checkClickedObject() {
    if (this.noActClick) {
      return;
    }

    if (!this.clicked) {
      return;
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects([...this.clickableObjectsMap.values()], false);
    if (intersects.length > 0) {
      const obj = this.clickableObjectsMap.get(intersects[0].object.id)
      if (obj) {
        obj.onClick(this.camera);
      }
    }

    this.clicked = false;
  }

  public setNoActClick(click: boolean) {
    this.noActClick = click;
  }

}
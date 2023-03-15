import * as THREE from 'three';
import { FlowCounter } from './FlowCounter';

import "./FlowCounterDialog.css";

export class FlowCounterDialog {
  private dialogEle: HTMLElement;
  private flowCounter: FlowCounter;
  private camera: THREE.Camera;
  private isVisible: boolean = true;
  private onClose: () => void;

  constructor (
    flowCounter: FlowCounter,
    camera: THREE.Camera,
    onClose: () => void,
  ) {
    this.flowCounter = flowCounter;
    this.camera = camera;
    this.onClose = onClose;

    const { sx, sy } = this.getXY(globalThis.OUTPUT_ELEMENT, flowCounter);
    
    this.dialogEle = document.createElement('div');
    this.dialogEle.className = 'darkVision-flowCounterDialog';
    this.dialogEle.style.transform = `translate(${sx}px, ${sy}px)`;

    this.dialogEle.innerHTML = this.makeHtmlElement(flowCounter.getSrcIP(), flowCounter.getCount());
    
    globalThis.OUTPUT_ELEMENT.appendChild(this.dialogEle);
  }

  private makeHtmlElement(srcip: string, count: number): string {
    return `
    <div class="darkVision-flowCounterDialog__close js-flowCounterDialog-close"></div>
    <table>
      <tr>
        <th>srcip</th>
        <td class="js-flowCounterDialog-srcip">${srcip}</td>
      </tr>
      <tr>
        <th>count</th>
        <td class="js-flowCounterDialog-count">${count}</td>
      </tr>
    </table>
    `
  }

  private getXY(outputEle: HTMLElement, obj: THREE.Object3D): {sx: number, sy: number} {
    const width = outputEle.clientWidth;
    const height = outputEle.clientHeight;

    const worldPosition = obj.getWorldPosition(new THREE.Vector3());
    const projection = worldPosition.project(this.camera);
    const sx = (width / 2) * (+projection.x + 1.0);
    const sy = (height / 2) * (-projection.y + 1.0);
    return { sx, sy }
  }

  public animateStart() {
    this.dialogEle.querySelector('.js-flowCounterDialog-close')?.addEventListener('click', this.removeDialog)
    this.update();
  }

  private update() {
    requestAnimationFrame(() => { 
      if(this.isVisible) this.update();
    });
    
    const { sx, sy } = this.getXY(globalThis.OUTPUT_ELEMENT, this.flowCounter);
    this.dialogEle.style.transform = `translate(${sx}px, ${sy}px)`;

    const srcipEle = this.dialogEle.querySelector(".js-flowCounterDialog-srcip");
    if (srcipEle) srcipEle.textContent = this.flowCounter.getSrcIP();
    
    const countEle = this.dialogEle.querySelector(".js-flowCounterDialog-count");
    if (countEle) countEle.textContent = this.flowCounter.getCount().toString();

  }

  private removeDialog = () => {
    this.isVisible = false;
    this.dialogEle.remove();
    this.onClose();
  }
}
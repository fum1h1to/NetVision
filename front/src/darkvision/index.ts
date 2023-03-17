import { Setting } from './htmlComponents/Setting/Setting';
import { DarkVisionCore } from './core/DarkVisionCore';

import './index.css';
import { ConstantManager } from './global/ConstantManager';
import { Information } from './htmlComponents/Information/Information';

export class DarkVision {
  private darkVisionCore: DarkVisionCore | null;

  constructor(outputEle: HTMLElement) {
    globalThis.OUTPUT_ELEMENT = outputEle;
    globalThis.OUTPUT_ELEMENT.classList.add('darkVision-rootEle');

    const constantManager = new ConstantManager();
    globalThis.constantManager = constantManager;

  }

  public async init() {
    await globalThis.constantManager.init();

    this.darkVisionCore = new DarkVisionCore(globalThis.OUTPUT_ELEMENT);
    this.darkVisionCore.init();
    this.darkVisionCore.start();
    
    new Information().insertTo(globalThis.OUTPUT_ELEMENT);
    new Setting().insertTo(globalThis.OUTPUT_ELEMENT);

  }

}
import { Setting } from './htmlComponents/Setting/Setting';
import { NetVisionCore } from './core/NetVisionCore';

import './index.css';
import { ConstantManager } from './global/ConstantManager';
import { Information } from './htmlComponents/Information/Information';

export class NetVision {
  private netVisionCore: NetVisionCore | null;

  constructor(outputEle: HTMLElement) {
    globalThis.OUTPUT_ELEMENT = outputEle;
    globalThis.OUTPUT_ELEMENT.classList.add('netVision-rootEle');

    const constantManager = new ConstantManager();
    globalThis.constantManager = constantManager;

  }

  public async init() {
    await globalThis.constantManager.init();

    this.netVisionCore = new NetVisionCore(globalThis.OUTPUT_ELEMENT);
    this.netVisionCore.init();
    this.netVisionCore.start();
    
    new Information().insertTo(globalThis.OUTPUT_ELEMENT);
    new Setting().insertTo(globalThis.OUTPUT_ELEMENT);

    setTimeout((() => {
      location.reload();
    }), globalThis.constantManager.getAPPLICATION_RELOAD_INTERVAL() * 60 * 60 * 1000);

  }

}
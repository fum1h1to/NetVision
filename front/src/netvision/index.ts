import { Setting } from './htmlComponents/Setting/Setting';
import { NetVisionCore } from './core/NetVisionCore';

import './index.css';
import { ConstantManager } from './global/ConstantManager';
import { Information } from './htmlComponents/Information/Information';
import { LatLng } from './models/LatLng';

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

    this.getBrowserLatLng().then((position) => {
      globalThis.constantManager.setPACKET_GOAL(position);
    }).catch((error) => {
      console.log(error.message);
    });

    this.netVisionCore = new NetVisionCore(globalThis.OUTPUT_ELEMENT);
    globalThis.constantManager.setNetVisionCore(this.netVisionCore);
    this.netVisionCore.init();
    this.netVisionCore.start();
    
    new Information().insertTo(globalThis.OUTPUT_ELEMENT);
    new Setting().insertTo(globalThis.OUTPUT_ELEMENT);

    setTimeout((() => {
      location.reload();
    }), globalThis.constantManager.getAPPLICATION_RELOAD_INTERVAL() * 60 * 60 * 1000);

  }

  public getBrowserLatLng(options: PositionOptions = {}) {
    return new Promise<LatLng>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        }, (error) => {
          reject(error);
        }, options);
      } else {
        return reject('Geolocation is not supported by this browser.');
      }
    })
  }

}
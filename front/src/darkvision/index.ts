import Worker from './worker?worker';

export class DarkVision {
  private width: number;
  private height: number;
  private rootEle: HTMLElement;
  private offscreenCanvas: OffscreenCanvas;

  constructor(outputEle: HTMLElement) {
    this.rootEle = outputEle;

    // 幅と高さの取得
    this.width = outputEle.clientWidth;
    this.height = outputEle.clientHeight;

    // canvasとoffscreenCanvasの生成
    const canvas = document.createElement("canvas");
    outputEle.appendChild(canvas);
    this.offscreenCanvas = canvas.transferControlToOffscreen();
    console.log(this.offscreenCanvas);
  }

  public init() {
    const worker = new Worker();

    worker.postMessage(
      {
        type: 'init',
        canvas: this.offscreenCanvas,
        width: this.width,
        height: this.height,
        devicePixelRatio: window.devicePixelRatio,
      },
      [this.offscreenCanvas]
    );

    window.addEventListener('resize', () => {
      this.width = this.rootEle.clientWidth;
      this.height = this.rootEle.clientHeight;

      worker.postMessage({
        type: 'resize',
        width: this.width,
        height: this.height,
        devicePixelRatio: window.devicePixelRatio,
      });
    });

  }
}
// @ts-ignore
const _worker: Worker = self as any;

// @ts-ignore
let darkVision: DarkVisionWorker;

_worker.onmessage = async (event: MessageEvent) => {
  const { DarkVisionWorker } = await import('./DarkVisionWorker');
  
  switch (event.data.type) {
    case 'init':
      darkVision = new DarkVisionWorker(event.data.canvas, event.data.width, event.data.height, event.data.devicePixelRatio);
      darkVision.init();
      darkVision.start();
      break;
    case 'resize':
      darkVision.resize(event.data.width, event.data.height, event.data.devicePixelRatio);
      break;
  }
}
// @ts-ignore
const _worker: Worker = self as any;

/**
 * Flowの軌道計算を行う
 */
_worker.onmessage = async (event: MessageEvent) => {
  const { createOrbitPoints } = await import('./createOrbitPoints');

  const { id, radius, start, goal, height, aliveTime } = event.data;
  const output = createOrbitPoints(id, radius, start, goal, height, aliveTime)

  _worker.postMessage(output);
};
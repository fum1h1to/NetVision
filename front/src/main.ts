import { NetVision } from "./netvision";

const outputEle = document.getElementById('netVision')!;
window.addEventListener('load', () => {
  const netVision = new NetVision(outputEle);
  netVision.init();
  
});
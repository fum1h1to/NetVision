import { DarkVision } from "./darkvision";

const outputEle = document.getElementById('darkVision')!;
window.addEventListener('load', () => {
  const darkVision = new DarkVision(outputEle);
  darkVision.init();
  darkVision.start();
});
import { DarkVision } from "./darkvision";

const outputEle = document.querySelector<HTMLElement>('#darkVision')!;
window.addEventListener('load', () => {
  const darkVision = new DarkVision(outputEle);
  darkVision.init();
});
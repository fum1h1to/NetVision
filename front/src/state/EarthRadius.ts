import { atom } from "recoil";

export const earthRadiusAtom = atom<number>({
  key: "earthRadius",
  default: 8,
});

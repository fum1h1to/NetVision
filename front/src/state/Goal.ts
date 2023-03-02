import { atom } from "recoil";
import { LatLng } from "../models/LatLng";

export const goalAtom = atom<LatLng>({
  key: "goal",
  default: { lat: 35, lng: 140 },
});

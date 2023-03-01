import { atom } from "recoil";
import { LatLng } from "../models/LatLng";

export const goalAtom = atom<LatLng>({
  key: "goal",
  default: { lat: 140, lng: 35 },
});

import { LatLng } from "./LatLng";

export type ExchangeData = {
  from: LatLng;
  srcip: string;
  srcport: string;
  protocolType: string;
};

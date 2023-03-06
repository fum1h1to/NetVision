import { LatLng } from "./LatLng";

export type PacketData = {
  from: LatLng;
  srcip: string;
  srcport: string;
  protocolType: string;
  abuseIPScore: number;
  packetCount: number;
};

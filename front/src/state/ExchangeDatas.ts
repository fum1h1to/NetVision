import { ExchangeData } from "../models/ExchangeData";
import { atom } from "recoil";

export const exchangeDataListAtom = atom<ExchangeData[]>({
  key: "exchangeDataList",
  default: [],
});

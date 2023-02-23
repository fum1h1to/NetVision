import { websocketAtom } from "../state/Websocket";
import { exchangeDataListAtom } from "../state/ExchangeDatas";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { ExchangeData } from "../models/ExchangeData";

export const useExchangeDataList = (): ExchangeData[] => {
  const socket = useRecoilValue(websocketAtom);
  const exchangeDataList = useRecoilValue(exchangeDataListAtom);

  const updateExchangeDataList = useRecoilCallback(
    ({ set }) =>
      (exchangeData: ExchangeData) => {
        set(exchangeDataListAtom, [...exchangeDataList, exchangeData]);
      }
  );
  socket.onmessage = (msg) => {
    const content = JSON.parse(msg.data as string);
    const exchangeData: ExchangeData = content as ExchangeData;
    // console.log(exchangeData);
    updateExchangeDataList(exchangeData);
  };

  return exchangeDataList;
};

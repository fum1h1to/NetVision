import { exchangeDataListAtom } from "../state/ExchangeDatas";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { ExchangeData } from "../models/ExchangeData";
import useWebSocket from "react-use-websocket";
import { useEffect, useRef } from "react";

export const useExchangeDataList = (): ExchangeData[] => {
  const websocketURL = "ws://localhost:8080/ws";
  const didUnmount = useRef(false);
  useWebSocket(websocketURL, {
    shouldReconnect: () => {
      return didUnmount.current === false;
    },
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    onMessage: (message) => {
      updateExchangeDataList(JSON.parse(message.data));
    },
  });

  const exchangeDataList = useRecoilValue(exchangeDataListAtom);

  const updateExchangeDataList = useRecoilCallback(
    ({ set }) =>
      (exchangeData: ExchangeData[]) => {
        // console.log(exchangeData);
        set(exchangeDataListAtom, exchangeData);
      }
  );

  useEffect(() => {
    return () => {
      didUnmount.current = true;
    };
  }, []);

  return exchangeDataList;
};

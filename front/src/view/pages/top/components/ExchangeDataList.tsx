import React from "react";
import { useExchangeDataList } from "../../../../hooks/use-exchangeData-list";

export const ExchangeDataList = () => {
  const exchangeDataList = useExchangeDataList();

  return (
    <div>
      {exchangeDataList.map((m, i) => (
        <div key={i}>{m.srcip}</div>
      ))}
    </div>
  );
};

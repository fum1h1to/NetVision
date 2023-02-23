import React, { Suspense } from "react";
import { useExchangeDataList } from "../../../../hooks/use-exchangeData-list";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./ErrorFallBack";

export const ExchangeDataList = () => {
  const exchangeDataList = useExchangeDataList();

  return (
    <div>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<>Loading...</>}>
          {exchangeDataList.map((m, i) => (
            <div key={i}>{m.srcip}</div>
          ))}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

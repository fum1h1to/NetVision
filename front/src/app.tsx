import React from "react";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
// import TestExchangeDataList from "./view/components/TestExchangeDataList/TestExchangeDataList";
import Top from "./view/pages/Top/Top";

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <Top />
    </RecoilRoot>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import Top from "./view/pages/Top/Top";

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <Top />
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById("root")
);

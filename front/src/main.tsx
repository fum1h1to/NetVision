import React from 'react'
import ReactDOM from 'react-dom/client'
import { RecoilRoot } from "recoil";
import './index.css'
import Top from './view/pages/Top/Top';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <Top />
    </RecoilRoot>
  </React.StrictMode>,
)

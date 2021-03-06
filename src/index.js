import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { RecoilRoot } from "recoil";
import GA4React from "ga-4-react";

const ga4react = new GA4React("G-9X735VQZZB");

(async () => {
  try {
    await ga4react.initialize();
  } catch (e) {
    console.log(e);
    console.log(
      "Google Tag Manager failed to Initialize. The client is likely using an Ad Blocker. To avoid this error, turn off Ad Blockers for this site."
    );
  }
  ReactDOM.render(
    <React.StrictMode>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </React.StrictMode>,
    document.getElementById("root")
  );
})();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

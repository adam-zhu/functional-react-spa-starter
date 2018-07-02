import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

const target = document.querySelector("#root");
ReactDOM.render(<App />, target);
registerServiceWorker();

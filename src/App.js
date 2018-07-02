import React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import store, { history } from "./Store";
import "./App.css";
import Header from "./Components/Header";
import Routes from "./Routes";

export default () => {
  return (
    <div id="app-container">
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>
            <Header />
            <Routes />
          </div>
        </ConnectedRouter>
      </Provider>
    </div>
  );
};

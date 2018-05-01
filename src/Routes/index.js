import React from "react";
import { Route } from "react-router-dom";
import Home from "./Home";
import Boilerplate from "./Boilerplate";

export const HomePath: string = "/";
export const BoilerplatePath: string = "/boilerplate";

export default () => (
  <main>
    <Route exact path={HomePath} component={Home} />,
    <Route exact path={BoilerplatePath} component={Boilerplate} />
  </main>
);

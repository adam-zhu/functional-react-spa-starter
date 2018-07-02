// @flow
import * as React from "react";
import { Route } from "react-router-dom";
import Home from "./Home";
import Boilerplate from "./Boilerplate";
import Users from "./Users";

export const HomePath: string = "/";
export const BoilerplatePath: string = "/boilerplate";
export const UsersPath: string = "/users";

export default () => (
  <main>
    <Route exact path={HomePath} component={Home} />
    <Route exact path={BoilerplatePath} component={Boilerplate} />
    <Route exact path={UsersPath} component={Users} />
  </main>
);

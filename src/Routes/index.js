// @flow
import * as React from 'react';
import { Route } from 'react-router-dom';
import Home from './Home';
import Boilerplate from './Boilerplate';
import Teams from './Teams';

export const HomePath: string = '/';
export const BoilerplatePath: string = '/boilerplate';
export const TeamsPath: string = '/teams';

export default () => (
  <main>
    <Route exact path={HomePath} component={Home} />,
    <Route exact path={BoilerplatePath} component={Boilerplate} />
    <Route exact path={TeamsPath} component={Teams} />
  </main>
);

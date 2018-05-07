// @flow
import * as React from "react";
import { connect } from "react-redux";
import { type RootState } from "../Store/RootReducer";
import { Link } from "react-router-dom";
import { HomePath, BoilerplatePath, TeamsPath } from "../Routes";

type mappedState = {|
  current_path: string
|};

const mapStateToProps = (rootState: RootState, ownProps): mappedState => {
  return {
    current_path: rootState.routing.location.pathname
  };
};

type mappedHandlers = {||};

const mapDispatchToProps = (dispatch, ownProps): mappedHandlers => {
  return Object.freeze({});
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ({ current_path }: mappedState & mappedHandlers): React.Node => {
    return (
      <header>
        <nav>
          <Link
            to={HomePath}
            className={current_path === HomePath ? "active" : ""}
          >
            Home
          </Link>
          <Link
            to={BoilerplatePath}
            className={current_path === BoilerplatePath ? "active" : ""}
          >
            Boilerplate
          </Link>
          <Link
            to={TeamsPath}
            className={current_path === TeamsPath ? "active" : ""}
          >
            Teams
          </Link>
        </nav>
      </header>
    );
  }
);

// @flow
import * as React from "react";
import { connect } from "react-redux";
import { type RootState } from "../Store/RootReducer";
import { Link } from "react-router-dom";
import { HomePath, BoilerplatePath, UsersPath } from "../Routes";

type mappedState = {|
  current_path: string | null
|};
const mapState = (rootState: RootState, ownProps): mappedState => {
  return {
    current_path: rootState.routing.location.pathname
  };
};

type mappedHandlers = {||};
const mapHandlers = (dispatch, ownProps): mappedHandlers => {
  return Object.freeze({});
};

const Header = ({ current_path }: mappedState & mappedHandlers): React.Node => {
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
          to={UsersPath}
          className={current_path === UsersPath ? "active" : ""}
        >
          Users
        </Link>
      </nav>
    </header>
  );
};

export default connect(
  mapState,
  mapHandlers
)(Header);

// @flow
import * as React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { HomePath, BoilerplatePath } from "../Routes";

type mappedState = {|
  current_path: string
|};

const mapStateToProps = (rootState, ownProps): mappedState => {
  return {
    current_path: rootState.routing.location.pathname
  };
};

type mappedHandlers = {||};

const mapDispatchToProps = (dispatch, ownProps): mappedHandlers => {
  return Object.freeze({});
};

type RenderProps = mappedState & mappedHandlers;
export default connect(mapStateToProps, mapDispatchToProps)(
  ({ current_path }: RenderProps): React.Node => {
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
        </nav>
      </header>
    );
  }
);

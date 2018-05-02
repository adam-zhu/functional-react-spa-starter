// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import './container.css';
import { type RootState, type Dispatch } from '../../Store/RootReducer';
import { type SubmitHandler } from '../../Helpers/types';
import { increment, decrement } from './reducer';
import { push } from 'react-router-redux';
import { BoilerplatePath } from '../../Routes';

type mappedState = {|
  count: number
|};

const mapStateToProps = (rootState: RootState, ownProps): mappedState => {
  return {
    count: rootState.Home.count
  };
};

type mappedHandlers = {|
  navigate_to_boilerplate_handler: SubmitHandler,
  increment_handler: SubmitHandler,
  decrement_handler: SubmitHandler
|};

const mapDispatchToProps = (dispatch: Dispatch, ownProps): mappedHandlers => {
  return {
    navigate_to_boilerplate_handler: e => {
      e.preventDefault();
      dispatch(push(BoilerplatePath));
    },
    increment_handler: e => {
      e.preventDefault();
      dispatch(increment());
    },
    decrement_handler: e => {
      e.preventDefault();
      dispatch(decrement());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ({
    count,
    navigate_to_boilerplate_handler,
    increment_handler,
    decrement_handler
  }: mappedState & mappedHandlers): React.Node => {
    return (
      <div className="page-body home">
        <h1>Home</h1>

        <form onSubmit={navigate_to_boilerplate_handler}>
          <button type="submit">
            Dispatch a redux action to navigate to the Boilerplate page
          </button>
        </form>

        <p>Count: {count}</p>

        <div className="count-actions">
          <form onSubmit={increment_handler}>
            <button type="submit">Increment</button>
          </form>

          <form onSubmit={decrement_handler}>
            <button type="submit">Decrement</button>
          </form>
        </div>
      </div>
    );
  }
);

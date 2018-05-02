// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import './container.css';
import { type RootState, type Dispatch } from '../../Store/RootReducer';
import { type SubmitHandler } from '../../Helpers/types';
import { load_new_gif_url } from './reducer';

type mappedState = {|
  error: string | null,
  busy: boolean,
  gif_url: string | null
|};

const mapStateToProps = (rootState: RootState, ownProps): mappedState => {
  return {
    error: rootState.Boilerplate.error,
    busy: rootState.Boilerplate.busy,
    gif_url: rootState.Boilerplate.gif_url
  };
};

type mappedHandlers = {|
  load_new_gif_handler: SubmitHandler
|};

const mapDispatchToProps = (dispatch: Dispatch, ownProps): mappedHandlers => {
  return {
    load_new_gif_handler: e => {
      e.preventDefault();
      dispatch(load_new_gif_url());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ({
    error,
    busy,
    gif_url,
    load_new_gif_handler
  }: mappedState & mappedHandlers): React.Node => {
    return (
      <div className="page-body boilerplate">
        <h1>Boilerplate</h1>
        {error !== null ? (
          <div className="error">{error}</div>
        ) : gif_url === null ? (
          <div className="gif loading">Loading...</div>
        ) : (
          <div className="gif" style={{ backgroundImage: `url(${gif_url})` }} />
        )}
        <form onSubmit={load_new_gif_handler}>
          <button type="submit" disabled={busy}>
            Load New GIF
          </button>
        </form>
      </div>
    );
  }
);

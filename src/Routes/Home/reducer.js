// @flow
import {
  type Dispatch,
  type GetState,
  type ThunkAction
} from '../../Store/RootReducer';

export type HomeState = {|
  +count: number
|};

const initialState: HomeState = {
  count: 0
};

export type HomeAction =
  | {| type: 'home/reset' |}
  | {| type: 'home/increment' |}
  | {| type: 'home/decrement' |};

export default (
  state: HomeState = initialState,
  action: HomeAction
): HomeState => {
  switch (action.type) {
    case 'home/reset':
      return {
        ...initialState
      };

    case 'home/increment':
      return {
        ...state,
        count: state.count + 1
      };

    case 'home/decrement':
      return {
        ...state,
        count: state.count - 1
      };

    default:
      return state;
  }
};

export const on_route_match = (): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch({
      type: 'home/reset'
    });
  };
};

export const increment = (): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch({
      type: 'home/increment'
    });
  };
};

export const decrement = (): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch({
      type: 'home/decrement'
    });
  };
};

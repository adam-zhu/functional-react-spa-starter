// @flow

type ThunkAction = (dispatch: Dispatch, getState: () => {}) => void | {};
type Dispatch = (action: ThunkAction | Action) => void;

type State = {|
  +count: number
|};

const initialState: State = {
  count: 0
};

type Action =
  | {| type: "home/reset" |}
  | {| type: "home/increment" |}
  | {| type: "home/decrement" |};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case "home/reset":
      return {
        ...initialState
      };

    case "home/increment":
      return {
        ...state,
        count: state.count + 1
      };

    case "home/decrement":
      return {
        ...state,
        count: state.count - 1
      };

    default:
      return state;
  }
};

export const on_route_match = (): ThunkAction => {
  return (dispatch: Dispatch, getState) => {
    dispatch({
      type: "home/reset"
    });

    // react-snapshot does build time pre rendering via jsdom
    document.title = "Home";
  };
};

export const increment = (): ThunkAction => {
  return (dispatch: Dispatch, getState) => {
    dispatch({
      type: "home/increment"
    });
  };
};

export const decrement = (): ThunkAction => {
  return (dispatch: Dispatch, getState) => {
    dispatch({
      type: "home/decrement"
    });
  };
};

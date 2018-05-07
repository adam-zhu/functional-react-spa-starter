// @flow
import { type Dispatch, type GetState, type ThunkAction } from "./RootReducer";

interface Dimensions {
  +width: number | null;
  +height: number | null;
}

export type ViewportState = {|
  +layout_viewport: Dimensions,
  +window_viewport: Dimensions
|};

const initialState: ViewportState = {
  layout_viewport: {
    width: null,
    height: null
  },
  window_viewport: {
    width: null,
    height: null
  }
};

export type ViewportAction =
  | {| type: "window/reset" |}
  | {| type: "window/memorize_window_state", payload: ViewportState |};

export default (
  state: ViewportState = initialState,
  action: ViewportAction
): ViewportState => {
  switch (action.type) {
    case "window/reset":
      return {
        ...initialState
      };

    case "window/memorize_window_state":
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
};

export const on_route_match = (): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch({
      type: "window/reset"
    });
  };
};

export const memorize_viewport_state = (): ThunkAction => {
  // dimensions in css pixels of the viewport the browser uses to layout the page
  // this does not include any persistent browser UI (address bar, scroll bar)
  // if browser is zoomed, these values do not change
  const layout_viewport = {
    width: document.documentElement
      ? document.documentElement.clientWidth
      : null,
    height: document.documentElement
      ? document.documentElement.clientHeight
      : null
  };

  // dimensions in css pixels of the browser window the user is looking through
  // this includes pieces of persistent browser UI
  // if browser is zoomed, these values do change
  const window_viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  return (dispatch: Dispatch, getState: GetState) => {
    dispatch({
      type: "window/memorize_window_state",
      payload: {
        layout_viewport,
        window_viewport
      }
    });
  };
};

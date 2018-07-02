// @flow
import {
  type Dispatch,
  type GetState,
  type ThunkAction
} from "../../Store/RootReducer";
import BoilerplateService from "../../Services/Boilerplate";

export type BoilerplateState = {|
  +error: string | null,
  +busy: boolean,
  +gif_url: string | null
|};

const initialState: BoilerplateState = {
  error: null,
  busy: false,
  gif_url: null
};

export type BoilerplateAction =
  | {| type: "boilerplate/reset" |}
  | {| type: "boilerplate/set_error", payload: string | null |}
  | {| type: "boilerplate/set_busy", payload: boolean |}
  | {| type: "boilerplate/set_gif_url", payload: string | null |};

export default (
  state: BoilerplateState = initialState,
  action: BoilerplateAction
): BoilerplateState => {
  switch (action.type) {
    case "boilerplate/reset":
      return {
        ...initialState
      };

    case "boilerplate/set_error":
      return {
        ...state,
        error: action.payload
      };

    case "boilerplate/set_busy":
      return {
        ...state,
        busy: action.payload
      };

    case "boilerplate/set_gif_url":
      return {
        ...state,
        gif_url: action.payload
      };

    default:
      return state;
  }
};

export const on_route_match = (): ThunkAction => {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch({
      type: "boilerplate/reset"
    });

    dispatch(load_new_gif_url());
  };
};

export const load_new_gif_url = (): ThunkAction => {
  return async (dispatch: Dispatch, getState: GetState) => {
    dispatch({
      type: "boilerplate/set_busy",
      payload: true
    });

    dispatch({
      type: "boilerplate/set_gif_url",
      payload: null
    });

    dispatch({
      type: "boilerplate/set_error",
      payload: null
    });

    try {
      const gif_url = await BoilerplateService.get_gif_url();

      dispatch({
        type: "boilerplate/set_busy",
        payload: false
      });

      dispatch({
        type: "boilerplate/set_gif_url",
        payload: gif_url
      });
    } catch (e) {
      const error = `${e.name}: ${e.message}`;

      dispatch({
        type: "boilerplate/set_error",
        payload: error
      });

      dispatch({
        type: "boilerplate/set_busy",
        payload: false
      });
    }
  };
};

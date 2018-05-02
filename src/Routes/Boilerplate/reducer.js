// @flow
import BoilerplateService from "../../Services/Boilerplate";

type ThunkAction = (dispatch: Dispatch, getState: () => {}) => void | {};
type Dispatch = (action: ThunkAction | Action) => void;

export type State = {|
  +error: string | null,
  +busy: boolean,
  +gif_url: string | null
|};

const initialState: State = {
  error: null,
  busy: false,
  gif_url: null
};

type Action =
  | {| type: "boilerplate/reset" |}
  | {| type: "boilerplate/set_error", payload: string | null |}
  | {| type: "boilerplate/set_busy", payload: boolean |}
  | {| type: "boilerplate/set_gif_url", payload: string | null |};

export default (state: State = initialState, action: Action): State => {
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
  return (dispatch: Dispatch, getState) => {
    dispatch({
      type: "boilerplate/reset"
    });

    dispatch(load_new_gif_url());
  };
};

export const load_new_gif_url = (): ThunkAction => {
  return async (dispatch: Dispatch, getState) => {
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
      const error = `${e.status ? e.status : "500"}: ${
        e.message ? e.message : e.toString()
      }`;

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

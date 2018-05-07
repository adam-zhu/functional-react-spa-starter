// @flow
import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import Viewport, {
  type ViewportState,
  type ViewportAction
} from "./ViewportReducer";
import Home, { type HomeState, type HomeAction } from "../Routes/Home/reducer";
import Boilerplate, {
  type BoilerplateState,
  type BoilerplateAction
} from "../Routes/Boilerplate/reducer";
import Teams, {
  type TeamsState,
  type TeamsAction
} from "../Routes/Teams/reducer";

type RoutesState = {
  Viewport: ViewportState,
  Home: HomeState,
  Boilerplate: BoilerplateState,
  Teams: TeamsState
};
export type Action =
  | ViewportAction
  | HomeAction
  | BoilerplateAction
  | TeamsAction;
export default combineReducers({
  routing: routerReducer,
  Viewport,
  Home,
  Boilerplate,
  Teams
});

type RoutingState = {
  location: {
    pathname: string,
    search: string,
    hash: string,
    key: string
  }
};
export type RootState = { routing: RoutingState } & RoutesState;
export type GetState = () => RootState;
export type Dispatch = (
  action:
    | Action
    | ((dispatch: Dispatch, getState: GetState) => void | Promise<void>)
) => void;
export type ThunkAction = (
  dispatch: Dispatch,
  getState: GetState
) => void | Promise<void>;

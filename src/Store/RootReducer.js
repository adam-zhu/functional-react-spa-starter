// @flow
import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import Home, { type HomeState, type HomeAction } from "../Routes/Home/reducer";
import Boilerplate, {
  type BoilerplateState,
  type BoilerplateAction
} from "../Routes/Boilerplate/reducer";
import Users, {
  type UsersState,
  type UsersAction
} from "../Routes/Users/reducer";

type RoutingState = {
  location: {
    pathname: string | null,
    search: string | null,
    hash: string | null,
    key: string | null
  }
};

export type RootState = {
  routing: RoutingState,
  Home: HomeState,
  Boilerplate: BoilerplateState,
  Users: UsersState
};

export type Action = HomeAction | BoilerplateAction | UsersAction;

export default combineReducers({
  routing: routerReducer,
  Home,
  Boilerplate,
  Users
});

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

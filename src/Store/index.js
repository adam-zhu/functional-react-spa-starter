import { createStore, applyMiddleware, compose } from "redux";
import { routerMiddleware } from "react-router-redux";
import thunk from "redux-thunk";
import createHistory from "history/createBrowserHistory";
import rootReducer from "./RootReducer";
import { reset_window_scroll } from "../Helpers/utils";

export const history = createHistory();
const initialState = {};
const enhancers = [];
const resetWindowScrollOnRouterLocationChange = store => next => action => {
  if (action.type === "@@router/LOCATION_CHANGE") {
    reset_window_scroll();
  }

  return next(action);
};
const middleware = [
  thunk,
  routerMiddleware(history),
  resetWindowScrollOnRouterLocationChange
];

if (process.env.NODE_ENV === "development") {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsExtension === "function") {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

export default createStore(rootReducer, initialState, composedEnhancers);

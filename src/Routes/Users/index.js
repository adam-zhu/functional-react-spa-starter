// @flow
import AsyncWrapper from "../../Helpers/AsyncWrapper";
import RouteLoading from "../../Components/RouteLoading";
import { on_route_match } from "./reducer";

export default AsyncWrapper({
  importComponent: () => import("./container"),
  mountCallback: on_route_match,
  el_loading: RouteLoading
});

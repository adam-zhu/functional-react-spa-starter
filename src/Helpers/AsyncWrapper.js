// @flow
import * as React from "react";
import store from "../Store";
import { reset_window_scroll } from "../Helpers/utils";
import { memorize_viewport_state } from "../Store/ViewportReducer";

type State = {
  component: ?React.StatelessFunctionalComponent<{}>
};

export default ({
  importComponent,
  mountCallback,
  el_loading
}: {
  importComponent: () => Promise<{
    default: React.StatelessFunctionalComponent<{}>
  }>,
  mountCallback: ?() => {},
  el_loading: ?React.StatelessFunctionalComponent<{}>
}) =>
  class AsyncComponent extends React.Component<{}, State> {
    constructor(props: {}) {
      super(props);

      this.state = {
        component: null
      };
    }

    async componentDidMount() {
      const { default: component } = await importComponent();

      if (typeof mountCallback === "function") {
        store.dispatch(mountCallback());
      }

      // record window dimensions
      store.dispatch(memorize_viewport_state());
      window.addEventListener("resize", () =>
        store.dispatch(memorize_viewport_state())
      );

      reset_window_scroll();

      this.setState({
        component
      });
    }

    render() {
      const C = this.state.component;
      const LoadingIndicator = el_loading;

      return C ? (
        <C {...this.props} />
      ) : LoadingIndicator ? (
        <LoadingIndicator />
      ) : null;
    }

    componentWillUnmount() {
      window.removeEventListener("resize");
    }
  };

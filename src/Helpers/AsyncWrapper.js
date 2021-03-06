// @flow
import * as React from "react";
import Store from "../Store";

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
        Store.dispatch(mountCallback());
      }

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
  };

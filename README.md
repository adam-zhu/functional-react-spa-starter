# functional-react-spa-starter

Boilerplate for a client side backend agnostic single page web app using `react` for rendering, `react-router` for routing, `redux` for state management, and `webpack` for bundling.

React is a UI library that uses a lightweight DOM abstraction (virtual DOM) that sits between the code and the DOM the browser displays. React allows the developer to build the application all in javascript using JSX to represent vDOM which it transforms into real DOM for the user's browser to display. Its core class is `Component` which contains methods for state, render, and other "lifecycle" methods. Application logic is defined in a scaffold of these `Component`s. This logic generates a set of virtual DOM nodes that are then diffed against the set of nodes that generated the DOM that the client's browser has currently rendered and only when a diff is generated is the DOM touched. This makes updating state hardly affect performance since vDOM overhead is sufficiently low thanks to React's optimization. In combination with a state manager like Redux, this means that you can reason with state with agility and reliability and build a very performant app quickly and easily.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). Find its very thorough and informative readme there. The bulk of the information about the project including instructions related to building the bundle, updating the scripts, and implementing further customization is documented there.

Details regarding the customizations on top of the default `create-react-app` behavior are described below.

## Flow

Flow is a static type checker for javascript. Static type checking is a _Good Idea™_. Each route's reducer exports its types and the root reducer file imports them and uses them to build the composite root types, which are then exported again for type safety anywhere state touched.

## Redux

Redux is a state management library. It works by creating a global state object and exposing functions to connect component state to the central store. Redux features only one way to alter state, "dispatching an action to the store". The "store" is the global state object, comprised of one or more "reducers". A "reducer" is a function that takes in a chunk of state and an "action" and returns a new chunk of state. An "action" is an object containing a `type` and optionally, any other data needed to update state. This is typically passed on `action.payload`.

## redux-thunk

`redux-thunk` is used to handle asynchronous actions. `redux-thunk` is redux middleware. It allows us to write our action creators as thunks (functions that return functions) rather than functions that return actions. The returned functions are then executed by `redux-thunk` middleware, passing `dispatch` and `getState` as arguments. They can have side effects like executing asynchronous API calls. With `dispatch` and `getState` they can also dispatch actions and read the current state.

## react-router-redux

`react-router-redux` is used to handle client side routing. It is the redux-integrated version of the popular `react-router` and provides a convenient interface to match URL paths to route components. `react-router-redux` binds the router state to redux by placing a `routerReducer` on the root reducer so that any redux connected component has scope to the current route and history. It also includes a `push` function that navigates to a path by dispatching a redux action.

## Sass

Sass is a superset of css with features likes mixins, variables, and nesting. `node-sass-chokidar` is used to compile scss to css. When the project is running in development mode or built, `node-sass-chokidar` watches for any modifications to `*.scss` files in the project and automatically compiles them to `.css`, outputting them next to the original `.scss` files. Ensure that the `.css` files are the ones included in js. If you're importing a `.scss` file elsewhere and would like it not to be compiled, name it`_{filename}.scss` and import it as `{filename}` in your source scss stylesheet. Since `*.scss` are the stylesheet source files, `*.css` in in the `.gitignore` file.

## route based code splitting with webpack based on dynamic imports

We define an `AsyncWrapper` component that takes a function to import a component and render that component when it has loaded. We pass that component a dynamic import statement for a route's container component. During build, webpack sees ES6 dynamic import statements and knows that the code doesn't need whatever the import returns until it runs and it knows to split everything behind it into a separate bundle. The result of this is a main bundle containing all of the code necessary to render any route and a seperate bundle for each route that is only loaded when that route is loaded from the main bundle. From the server the app only loads the code necessary to render the app agnostic of route and then when the router runs the current route's dynamically imported bundle is loaded.

# Project structure

```
functional-react-spa-starter/
  README.md
  node_modules/
  package.json
  public/
    index.html
    favicon.ico
  src/
    Components/
      Header.js
      RouteLoading.js
    Helpers/
      AsyncWrapper.js
      types.js
      utils.js
    Routes/
      index.js
      Home/
        index.js
        container.js
        reducer.js
        container.scss
      Boilerplate/
        index.js
        container.js
        reducer.js
        container.scss
      Teams/
        index.js
        container.js
        reducer.js
        container.scss
    Services/
      formatters/
        Teams.js
      Boilerplate.js
      Teams.js
      mocks.js
    Store/
      index.js
      RootReducer.js
    App.js
    App.scss
    App.test.js
    index.js
    registerServiceWorker.js
```

Each route's folder contains

* `index.js`: pure boilerplate. This file should never need to get touched. It includes the dynamic import for the route's container and includes the route reducer's `on_route_match` function which gets dispatched when the route mounts. `src/Components/RouteLoading` is also included here and passed to `AsyncWrapper` to display while the route's bundle loads.
* `container.js`: entry point for render. This file contains the route's mapStateToProps and mapDispatchToProps functions and its render function.
* `reducer.js`: this route's reducer and actions, including the boilerplated `on_route_match`
* `container.scss`: styles for this route

To create a new route, simply copy another route's folder and delete old code. Boilerplated file and function names do not need to change. The `src/Routes/index.js` file contains the export of all the routes, so be sure to update it with your new route. Similary `src/store/RootReducer.js` contains the export of all the reducers and root types. You will need to update it with your new route's reducer and types.

`src/App.js` contains the router context and imports all the routes, so any common components, like `src/Components/Header`, should be placed here.
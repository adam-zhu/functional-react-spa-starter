# functional-react-spa-starter

Boilerplate for a client side backend agnostic single page web app using `react` for rendering, `react-router` for routing, `redux` for state management, and `webpack` for bundling.

React is a UI library that uses a lightweight DOM abstraction (virtual DOM) that sits between the code and the DOM the browser displays. React allows the developer to build the application all in javascript using JSX to represent vDOM which it transforms into real DOM for the user's browser to display. Its core class is `Component` which contains methods for state, render, and other "lifecycle" methods. Application logic is defined in a scaffold of these `Component`s. This logic generates a set of virtual DOM nodes that are then diffed against the set of nodes that generated the DOM that the client's browser has currently rendered and only when a diff is generated is the DOM touched. This makes updating state hardly affect performance since vDOM overhead is sufficiently low thanks to React's optimization. In combination with a state manager like Redux, this means that you can reason with state with agility and reliability and build a very performant app quickly and easily.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). Find its very thorough and informative readme there. The bulk of the information about the project including instructions related to building the bundle, updating the scripts, and implementing further customization is documented there.

Details regarding the customizations on top of the default `create-react-app` behavior are described below.

## Flow

Flow is a static type checker for javascript. Static type checking is a *Good Idea™*.

## Redux

Redux is a state management library. It works by creating a global state object and exposing functions to connect component state to the central store. Redux features only one way to alter state, "dispatching an action to the store". The "store" is the global state object, comprised of one or more "reducers". A "reducer" is a function that takes in a chunk of state and an "action" and returns a new chunk of state. An "action" is an object containing a `type` and optionally, any other data needed to update state. This is typically passed on `action.payload`.

## redux-thunk

`redux-thunk` is used to handle asynchronous actions. `redux-thunk` is redux middleware. It allows us to write our action creators as thunks (functions that return functions) rather than functions that return actions. The returned functions are then executed by `redux-thunk` middleware, passing `dispatch` and `getState` as arguments. They can have side effects like executing asynchronous API calls. With `dispatch` and `getState` they can also dispatch actions and read the current state.

## react-router-redux

`react-router-redux` is used to handle client side routing. It is the redux-integrated version of the popular `react-router` and provides a convenient interface to match URL paths to route components. `react-router-redux` binds the router state to redux by placing a `routerReducer` on the root reducer so that any redux connected component has scope to the current route and history. It also includes a `push` function that navigates to a path by dispatching a redux action.

## Sass

Sass is a superset of css with features likes mixins, variables, and nesting. `node-sass-chokidar` is used to compile scss to css. When the project is running in development mode or built, `node-sass-chokidar` watches for any modifications to `*.scss` files in the project and automatically compiles them to `.css`, outputting them next to the original `.scss` files. Ensure that the `.css` files are the ones included in js. If you're importing a `.scss` file elsewhere and would like it not to be compiled, name it` _{filename}.scss` and import it as `{filename}` in your source scss stylesheet. Since `*.scss` are the stylesheet source files, `*.css` in in the `.gitignore` file.

## route based code splitting with webpack based on dynamic imports

We define an `AsyncWrapper` component that takes a function to import a component and render that component when it has loaded. We pass that component a dynamic import statement for a route's container component. During build, webpack sees ES6 dynamic import statements and knows that the code doesn't need whatever the import returns until it runs and it knows to split everything behind it into a separate bundle. The result of this is a main bundle containing all of the code necessary to render any route and a seperate bundle for each route that is only loaded when that route is loaded from the main bundle. From the server the app only loads the code necessary to render the app agnostic of route and then when the router runs the current route's dynamically imported bundle is loaded. This component is also the _only_ component written in classical style with React.Component lifecycle methods. It exposes an interface to pass a placeholder render while the route's bundle is being loaded as well as a callback action to dispatch once the route finishes loading.

## server side rendering static site generator via react-snapshot

`react-snapshot` is used to generate static content "snapshots" of each route at build time. It spins up a server and renders the app in a jsdom environment and saves the HTML/CSS generated by each route which is then served whenever the route is hit on the server. The file includes the js bundle to render the rest of the app, which loads while your app displays with its styles. This allows robots to index the static content in the app for search engines, helps load times, and *is a zero config build time freebie*. It is also easy to remove. NOTE: keep in mind that any prerendered routes must be part of the main bundle. This means that they cannot be wrapped in an `AsyncWrapper`. It may be tempting to use this as an actual static site generator and an SPA and have the best of both worlds, but touching DOM to set page state is a side effect and should not be done. This arguably should not be a front end concern, but if it needed to be done it would be most appropriate to create another wrapper component with lifecycle for routes that need static rendering.

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
    Services/
      Boilerplate.js
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

To create a new route, simply copy another route's folder and delete old code. Boilerplated file and function names do not need to change. the `src/Routes/index.js` file contains the export of all the routes, so be sure to update it with your new route. Similary `src/store/RootReducer.js` contains the export of all the reducers. You will need to update it with your new route's reducer.

`src/App.js` contains the router context and imports all the routes, so any common components, like `src/Components/Header`, are rendered here.

# Architecture

The general pattern of each route can be described as a loop:

```
 __ gather state and transform into render props
|  |
|  render returns vDOM bound w/ event listeners
|  |
|  (react vDOM diff/patch > user interacts with screen and fires listener)
|  |
|  listener executes logic and dispatches an action to a reducer
|  |
|  (redux generates new state)
|__|
```

This is a _Good Idea™_ because it allows for the decoupling of state changing business logic from render logic and makes all pieces of UI 100% pure render functions.

# Opinions

Never mutate or destroy data anywhere. Always transform it into something new. No render function should transform its props data into anything but render or assert any business logic. Any data transformation should be done in formatters at the service level. Each container's mapStateToProps pulls the route reducer's state off the rootState and maps it into props. mapDispatchToProps glues actions to event listeners and then maps them into props. Render functions simply display those props. Adhering to this means that bugs are easily identified. If display is incorrect or an event listener does not fire it is in render. Otherwise, it is in business logic.

The only DOM touching should happen when you need to control something that React does not have access to like resetting the window scroll state. This currently happens inside AsyncWrapper's componentDidMount lifecycle method and executes every time an async wrapped route mounts.

Always use semantic elements to listen to things that alter state or the UI. This means react-router-dom `<Link>` for navigation or `<form>` for altering state. Listening to a `<form>`'s `onSubmit` event has many advantages. No having to deal with coverage of device cases, all of that is already implemented by the user's browser. It is accessible by default.

Do not control form element `value` state. Rather, simply harvest the form's input `value`s onSubmit. Not controlling the `value` may seem counterintuitive but it is not an antipattern. The fact is that in the case of form submission what the user sees is the truth and that is dictated by the DOM, not what is currently stored in vDOM. If form state is controlled via the `value` attribute then a race condition is introduced between what we render to the screen and what the user inputs next. If it is not controlled, then we cannot reset a form element's `value` after it has been submitted. Instead, control the `defaultValue` attribute with props then ensure the node is cycled out from the DOM via conditionally displaying the node with a piece of state. Even in cases like live validation where `value` must be tracked, harvest node values onSubmit. If tracked values are used to submit, there is still a theoretical race condition between what the user has inputted and submitted and what the code has captured.

When possible, do not render elements that do not need to be on the screen. Do not use css to conditionally display things. If necessary, like in cases of things like animation, ensure that only the container element is rendered when in hidden mode and only apply animation styles to the container css class. This is a security measure so users cannot access "hidden" form elements with a keyboard or otherwise. Even unsensitive elements should not be able to be accessed unless visible on the screen.

import React from "react";
import ReactDOM from "react-dom";
import AppRouter from "./router";
import { Provider } from "react-redux";
import store from "./store";
import { SET_USER, REACT_REDUX_LOCAL } from "./constants";

if (localStorage.getItem(REACT_REDUX_LOCAL)) {
  /**
   * trigger actions
   */
  store.dispatch({
    type: SET_USER,
    user: JSON.parse(localStorage.getItem(REACT_REDUX_LOCAL)),
  });
}

ReactDOM.render(
  <Provider store={store}>
    <AppRouter />
  </Provider>,
  document.getElementById("root")
);

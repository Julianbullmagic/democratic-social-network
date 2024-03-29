import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import MainRouter from './MainRouter'
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import Reducer from './reducers';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore);

ReactDOM.render(
  <Provider
      store={createStoreWithMiddleware(
          Reducer,
          window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      )}
  >
    <App />
        </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();

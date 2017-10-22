import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import {HashRouter} from "react-router-dom";
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import reducer from './reducers';
import thunk from 'redux-thunk';
import routes from "./routes";
import {loadAllCategories} from "./actions/categories";

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk)
)

store.dispatch(loadAllCategories())

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      {routes}
    </HashRouter>
  </Provider>
  , document.getElementById('root'));
registerServiceWorker();
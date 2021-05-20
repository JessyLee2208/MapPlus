import { createStore } from 'redux';
// import { composeWithDevTools } from 'redux-devtools-extension';

import storeReducer from './reducer/store_reducer';
// import menuReducer from './reducer/menu_reducer';
// const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store_reducer = createStore(
  storeReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
// const menu_reducer = createStore(menuReducer);

export { store_reducer };

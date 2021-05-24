import { createStore } from 'redux';

import storeReducer from './reducer/store_reducer';

const store_reducer = createStore(
  storeReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export { store_reducer };

import { createStore } from 'redux';

import storeReducer from './reducer/store_reducer';

const store_reducer = createStore(storeReducer);
export { store_reducer };

import { createStore } from 'redux';

import storeReducer from './product_reducer';

const store_Reducer = createStore(storeReducer);
export { store_Reducer };

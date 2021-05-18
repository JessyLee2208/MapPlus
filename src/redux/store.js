import { createStore } from 'redux';

import storeReducer from './reducer/store_reducer';
// import menuReducer from './reducer/menu_reducer';

const store_reducer = createStore(storeReducer);
// const menu_reducer = createStore(menuReducer);

export { store_reducer };

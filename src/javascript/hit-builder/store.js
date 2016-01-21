import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';

import {convertHitToParams, getInitialHitAndUpdateUrl} from './hit';
import reducer from './reducers';


let middlewear = [thunkMiddleware];


// Adds a logger in non-production mode.
if (process.env.NODE_ENV != 'production') {
  // Uses `require` here instead of `import` so the module isn't included
  // in the production build.
  middlewear.push(require('redux-logger')());
}


let createStoreWithMiddleware = applyMiddleware(...middlewear)(createStore);


export default createStoreWithMiddleware(reducer, {
  hitStatus: 'UNVALIDATED',
  isAuthorized: false,
  params: convertHitToParams(getInitialHitAndUpdateUrl())
});

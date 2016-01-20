import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';

import {convertHitToParams, getInitialHitAndUpdateUrl} from './hit';
import reducer from './reducers';


let createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);


export default createStoreWithMiddleware(reducer, {
  hitStatus: 'UNVALIDATED',
  isAuthorized: false,
  params: convertHitToParams(getInitialHitAndUpdateUrl())
});

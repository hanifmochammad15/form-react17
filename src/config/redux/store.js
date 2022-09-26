import { legacy_createStore as createStore, applyMiddleware } from 'redux'
import reducer from './reducer/reducer';
import thunk from 'redux-thunk';

const store = createStore(reducer, applyMiddleware(thunk));//perlu paramater berupa reducer

export default store;
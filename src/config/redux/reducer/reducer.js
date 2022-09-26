import { combineReducers }from 'redux';
import getDetailReducer from './getDetailReducer';
import channelReducer from './channelReducer';
import subChannelReducer from './subChannelReducer';
import kodePosReducer from './kodePosReducer';
import mccReducer from './mccReducer';
import pnReferralReducer from './pnReferralReducer';
import resultReducer from './resultReducer';
import createRegistrationReducer from './createRegistrationReducer';
import getTokenReducer from './getTokenReducer';

const reducer = combineReducers({ getDetailReducer, channelReducer, subChannelReducer, kodePosReducer, mccReducer, pnReferralReducer, resultReducer, createRegistrationReducer, getTokenReducer });

export default reducer;

import { createStore, combineReducers, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import CommonReducer from '@/redux/reducers/common';
import SettingReducer from '@/redux/reducers/setting';
import { composeWithDevToolsDevelopmentOnly } from '@redux-devtools/extension';

const reducer = combineReducers({
    CommonReducer,
    SettingReducer
});

const store = createStore(reducer, composeWithDevToolsDevelopmentOnly(applyMiddleware(reduxPromise)));

export default store;

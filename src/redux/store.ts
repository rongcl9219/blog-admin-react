import { createStore, combineReducers } from 'redux';
import CommonReducer from '@/redux/modules/common';
import SettingReducer from '@/redux/modules/setting';

const reducer = combineReducers({
    CommonReducer,
    SettingReducer
});

const store = createStore(reducer);

export default store;

import { createStore, combineReducers, applyMiddleware } from 'redux'
import reduxPromise from 'redux-promise'
import CommonReducer from '@/redux/reducers/common'
import UserReducer from '@/redux/reducers/user'
import { composeWithDevToolsDevelopmentOnly } from '@redux-devtools/extension'

const reducer = combineReducers({
    CommonReducer,
    UserReducer
})

const store = createStore(reducer, composeWithDevToolsDevelopmentOnly(applyMiddleware(reduxPromise)))

export default store

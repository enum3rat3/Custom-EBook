// store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { thunk } from 'redux-thunk'
import consumerReducer from "./consumerReducer"

const rootReducer = combineReducers({
  consumer: consumerReducer
})

const Store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(thunk)
})

export default Store

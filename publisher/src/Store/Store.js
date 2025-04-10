// store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { thunk } from 'redux-thunk'
import publisherReducer from "./publisherReducer"

const rootReducer = combineReducers({
  publisher: publisherReducer
})

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(thunk)
})

export default store

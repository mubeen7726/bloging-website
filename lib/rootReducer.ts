import { combineReducers } from '@reduxjs/toolkit';

// Import your feature reducers here
import counterReducer from '../features/counter/counterSlice';

const rootReducer = combineReducers({
  counter: counterReducer,
  // Add other reducers here
});

export default rootReducer;
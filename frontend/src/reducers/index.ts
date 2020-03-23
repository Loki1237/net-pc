import { combineReducers } from 'redux';
import messageReducer from './messageReducer';
import searchReducer from './searchReducer';

export const reducers = combineReducers({
    messages: messageReducer,
    search: searchReducer
});

export type RootState = ReturnType<typeof reducers>;

import { combineReducers } from 'redux';
import messageReducer from './messageReducer';
import searchReducer from './searchReducer';
import musicReducer from './musicReducer';

export const reducers = combineReducers({
    messages: messageReducer,
    search: searchReducer,
    music: musicReducer
});

export type RootState = ReturnType<typeof reducers>;

import { combineReducers } from 'redux';
import appStateReducer from './appStateReducer';

export const reducers = combineReducers({
    appState: appStateReducer
});

export type RootState = ReturnType<typeof reducers>;

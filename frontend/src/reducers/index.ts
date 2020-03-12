import { combineReducers } from 'redux';
import appStateReducer from './appStateReducer';
import messageReducer from './messageReducer';
import alertReducer from './alertReducer';

export const reducers = combineReducers({
    appState: appStateReducer,
    messages: messageReducer,
    alert: alertReducer
});

export type RootState = ReturnType<typeof reducers>;

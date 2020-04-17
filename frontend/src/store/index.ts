import { combineReducers } from 'redux';
import musicReducer from './music/reducer';
import searchReducer from './search/reducer';

export const reducers = combineReducers({
    music: musicReducer,
    search: searchReducer
});

export type RootState = ReturnType<typeof reducers>;

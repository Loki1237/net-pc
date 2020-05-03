import { combineReducers } from 'redux';
import musicReducer from './Music/reducer';
import searchReducer from './SearchPage/reducer';
import imageViawerReducer from './ImageViewer/reducer';
import userPageReducer from './UserPage/reducer';

export const reducers = combineReducers({
    music: musicReducer,
    search: searchReducer,
    images: imageViawerReducer,
    userState: userPageReducer
});

export type RootState = ReturnType<typeof reducers>;

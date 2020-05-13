import { combineReducers } from 'redux';
import musicReducer from './Music/reducer';
import searchReducer from './SearchPage/reducer';
import imageViawerReducer from './ImageViewer/reducer';
import userPageReducer from './UserPage/reducer';
import noteReducer from './Notes/reducer';
import bookmarkReducer from './Bookmarks/reducer';
import photoReducer from './Photo/reducer';

export const rootReducer = combineReducers({
    music: musicReducer,
    search: searchReducer,
    images: imageViawerReducer,
    users: userPageReducer,
    notes: noteReducer,
    bookmarks: bookmarkReducer,
    photos: photoReducer
});

export type RootState = ReturnType<typeof rootReducer>;

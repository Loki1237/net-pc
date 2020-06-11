import { combineReducers } from 'redux';
import musicReducer from './Music/reducer';
import searchReducer from './Search/reducer';
import imageViawerReducer from './ImageViewer/reducer';
import userPageReducer from './UserPage/reducer';
import noteReducer from './Notes/reducer';
import bookmarkReducer from './Bookmarks/reducer';
import photoReducer from './Photos/reducer';
import messageReducer from './Messages/reducer';
import editingReducer from './Editing/reducer';
import friendReducer from './Friends/reducer';
import authReducer from './AutBar/reducer';
import appReducer from './App/reducer';

export const rootReducer = combineReducers({
    music: musicReducer,
    search: searchReducer,
    images: imageViawerReducer,
    users: userPageReducer,
    notes: noteReducer,
    bookmarks: bookmarkReducer,
    photos: photoReducer,
    messages: messageReducer,
    editing: editingReducer,
    friends: friendReducer,
    auth: authReducer,
    app: appReducer
});

export type RootState = ReturnType<typeof rootReducer>;

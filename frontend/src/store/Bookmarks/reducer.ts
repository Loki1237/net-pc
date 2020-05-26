import {
    BookmarkState,
    BookmarkAction,
    BOOKMARKS_IS_LOADING,
    BOOKMARKS_ERROR,
    BOOKMARKS_SET_BOOKMARK_LIST,
    BOOKMARKS_RESET_STATE
} from './types';

const initialState = {
    isLoading: false,
    error: "",
    bookmarkList: []
}

export default function(state: BookmarkState = initialState, action: BookmarkAction): BookmarkState {
    switch (action.type) {
        case BOOKMARKS_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            };

        case BOOKMARKS_ERROR:
            return {
                ...state, 
                error: action.error
            };

        case BOOKMARKS_SET_BOOKMARK_LIST:
            return {
                ...state,
                bookmarkList: action.payload
            };

        case BOOKMARKS_RESET_STATE:
            return initialState;

        default:
            return state;
    }
}

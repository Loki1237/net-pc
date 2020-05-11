import {
    BookmarkState,
    BookmarkAction,
    BOOKMARKS_IS_LOADING,
    BOOKMARKS_HAS_ERRORED,
    BOOKMARKS_SET_BOOKMARK_LIST,
    BOOKMARKS_RESET_STATE
} from './types';

const initialState = {
    isLoading: false,
    hasErrored: false,
    bookmarkList: []
}

export default function(state: BookmarkState = initialState, action: BookmarkAction): BookmarkState {
    switch (action.type) {
        case BOOKMARKS_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading || false
            };

        case BOOKMARKS_HAS_ERRORED:
            return {
                ...state, 
                hasErrored: action.hasErrored || false
            };

        case BOOKMARKS_SET_BOOKMARK_LIST:
            return {
                ...state,
                bookmarkList: action.payload || []
            };

        case BOOKMARKS_RESET_STATE:
            return initialState;

        default:
            return state;
    }
}

export const BOOKMARKS_IS_LOADING = "BOOKMARKS_IS_LOADING";
export const BOOKMARKS_HAS_ERRORED = "BOOKMARKS_HAS_ERRORED";
export const BOOKMARKS_SET_BOOKMARK_LIST = "BOOKMARKS_SET_BOOKMARK_LIST";
export const BOOKMARKS_RESET_STATE = "BOOKMARKS_RESET_STATE";

interface LoadingAction {
    type: typeof BOOKMARKS_IS_LOADING,
    isLoading: boolean,
};

interface ErroredAction {
    type: typeof BOOKMARKS_HAS_ERRORED,
    hasErrored: boolean,
};

interface SetBookmarkListAction {
    type: typeof BOOKMARKS_SET_BOOKMARK_LIST,
    payload: Bookmark[]
};

interface ResetStateAction {
    type: typeof BOOKMARKS_RESET_STATE
};

export type BookmarkAction = LoadingAction
                             | ErroredAction
                             | SetBookmarkListAction
                             | ResetStateAction;

export interface Bookmark {
    id: number,
    userId: number,
    name: string,
    url: string
};

export interface BookmarkState {
    isLoading: boolean,
    hasErrored: boolean,
    bookmarkList: Bookmark[]
};

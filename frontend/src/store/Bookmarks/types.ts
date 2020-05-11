import { Action } from 'redux'
import { RootState } from '../index'
import { ThunkAction } from 'redux-thunk'

export interface BookmarkAction {
    type: string,
    isLoading?: boolean,
    hasErrored?: boolean,
    payload?: Bookmark[]
};

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

export type DispatchBookmarks = (arg: BookmarkAction) => void;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const BOOKMARKS_IS_LOADING = "BOOKMARKS_IS_LOADING";
export const BOOKMARKS_HAS_ERRORED = "BOOKMARKS_HAS_ERRORED";
export const BOOKMARKS_SET_BOOKMARK_LIST = "BOOKMARKS_SET_BOOKMARK_LIST";
export const BOOKMARKS_RESET_STATE = "BOOKMARKS_RESET_STATE";

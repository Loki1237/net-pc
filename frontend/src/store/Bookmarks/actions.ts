import { 
    BookmarkAction, 
    Bookmark,
    DispatchBookmarks,
    AppThunk,
    BOOKMARKS_IS_LOADING,
    BOOKMARKS_HAS_ERRORED,
    BOOKMARKS_SET_BOOKMARK_LIST,
    BOOKMARKS_RESET_STATE
} from './types';

export const bookmarksIsLoading = (value: boolean): BookmarkAction => ({
    type: BOOKMARKS_IS_LOADING,
    isLoading: value
})

export const bookmarksHasErrored = (value: boolean): BookmarkAction => ({
    type: BOOKMARKS_HAS_ERRORED,
    hasErrored: value
})

export const bookmarksSetBookmarkList = (payload: Bookmark[]): BookmarkAction => ({
    type: BOOKMARKS_SET_BOOKMARK_LIST,
    payload
})

export const bookmarksResetState = (): BookmarkAction => ({
    type: BOOKMARKS_RESET_STATE
})

const getBookmarks = async () => {
    const response = await fetch('/api/bookmarks');

    if (!response.ok) {
        throw Error(response.statusText);
    }

    return await response.json();
}

export const updateBookmarkList = (): AppThunk => {
    return async (dispatch: DispatchBookmarks) => {
        dispatch(bookmarksIsLoading(true));

        try {
            const bookmarks = await getBookmarks();
            dispatch(bookmarksIsLoading(false));
            dispatch(bookmarksSetBookmarkList(bookmarks));
        } catch {
            dispatch(bookmarksHasErrored(true));
        }
    };
}

export const createBookmark = (name: string, url: string): AppThunk => {
    return async (dispatch: DispatchBookmarks) => {
        await fetch(`/api/bookmarks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charser=utf-8"
            },
            body: JSON.stringify({ name, url })
        });

        const bookmarks = await getBookmarks();
        dispatch(bookmarksSetBookmarkList(bookmarks));
    };
}

export const changeBookmark = (name: string, url: string, id: number): AppThunk => {
    return async (dispatch: DispatchBookmarks) => {
        await fetch(`/api/bookmarks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charser=utf-8"
            },
            body: JSON.stringify({ name, url })
        });

        const bookmarks = await getBookmarks();
        dispatch(bookmarksSetBookmarkList(bookmarks));
    };
}

export const deleteBookmark = (id: number): AppThunk => {
    return async (dispatch: DispatchBookmarks) => {
        await fetch(`api/bookmarks/${id}`, { method: "DELETE" });
        
        const bookmarks = await getBookmarks();
        dispatch(bookmarksSetBookmarkList(bookmarks));
    };
}

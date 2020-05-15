export const SEARCH_IS_LOADING = "SEARCH_IS_LOADING";
export const SEARCH_HAS_ERRORED = "SEARCH_HAS_ERRORED";
export const SEARCH_SET_USER_LIST = "SEARCH_SET_USER_LIST";
export const SEARCH_RESET_STATE = "SEARCH_RESET_STATE";

interface LoadingAction {
    type: typeof SEARCH_IS_LOADING,
    isLoading: boolean,
};

interface ErroredAction {
    type: typeof SEARCH_HAS_ERRORED,
    hasErrored: boolean,
};

interface SetUserListListAction {
    type: typeof SEARCH_SET_USER_LIST,
    payload: User[]
};

interface ResetStateAction {
    type: typeof SEARCH_RESET_STATE
};

export type SearchAction = LoadingAction
                           | ErroredAction
                           | SetUserListListAction
                           | ResetStateAction;

export interface User {
    id: number,
    name: string,
    country: string,
    city: string,
    avatar: string
    status: string
};

export interface SearchState {
    isLoading: boolean,
    hasErrored: boolean,
    userList: User[]
};

import { AppThunkAction } from '../thunk';
import { Dispatch } from 'redux';
import {
    SearchAction,
    User,
    SEARCH_IS_LOADING,
    SEARCH_HAS_ERRORED,
    SEARCH_SET_USER_LIST,
    SEARCH_RESET_STATE
} from './types';

export const searchIsLoading = (value: boolean): SearchAction => ({
    type: SEARCH_IS_LOADING,
    isLoading: value
})

export const searchHasErrored = (value: boolean): SearchAction => ({
    type: SEARCH_HAS_ERRORED,
    hasErrored: value
})

export const searchSetUserList = (payload: User[]): SearchAction => ({
    type: SEARCH_SET_USER_LIST,
    payload
});

export const searchResetState = (): SearchAction => ({
    type: SEARCH_RESET_STATE
})

export const updateUserList = (name: string): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(searchIsLoading(true));

        try {
            const response = await fetch(`/api/users/search`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                body: JSON.stringify({
                    name
                })
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const users = await response.json();
            dispatch(searchSetUserList(users));
            dispatch(searchIsLoading(false));
        } catch {
            dispatch(searchHasErrored(true));
        }
    };
}

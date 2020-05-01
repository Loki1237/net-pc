import { SET_SEARCHED_USER_LIST, Action, SearchedUser } from './types';

export const setSearchedUserList = (payload: SearchedUser[]): Action => ({
    type: SET_SEARCHED_USER_LIST,
    payload
});
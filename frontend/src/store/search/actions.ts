import { SET_SEARCHED_USER_LIST, ActionType } from './types';

export const setSearchedUserList = (payload: object[]): ActionType => ({
    type: SET_SEARCHED_USER_LIST,
    payload
});
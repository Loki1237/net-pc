import { SET_SEARCHED_USER_LIST, Action, SearchedUser } from './types';

export default function(state: SearchedUser[], action: Action) {
    if (!state) return [];

    if (action.type === SET_SEARCHED_USER_LIST) {
        return action.payload;
    }

    return state;
}

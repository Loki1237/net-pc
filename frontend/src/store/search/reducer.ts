import { SET_SEARCHED_USER_LIST, ActionType } from './types';

export default function(state: object[], action: ActionType) {
    if (!state) return [];

    if (action.type === SET_SEARCHED_USER_LIST) {
        return action.payload;
    }

    return state;
}

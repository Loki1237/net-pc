import ActionType from '../types/ActionType';

export default function(state: object[], action: ActionType) {
    if (!state) return [];

    if (action.type === "SET_SEARCHED_USER_LIST") {
        return action.data;
    }

    return state;
}

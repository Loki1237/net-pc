import AppStateType from '../types/AppStateType';

interface ActionType {
    type: string,
    data: number
};

const initialState: AppStateType = {
    userId: null
};

export default function(state = initialState, action: ActionType): AppStateType {
    if (action.type === "SET_USER_ID") {
        return { ...state, userId: action.data };
    }

    return state;
}

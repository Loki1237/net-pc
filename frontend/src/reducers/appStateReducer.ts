import AppStateType from '../types/AppStateType';
import ActionType from '../types/ActionType';

const initialState: AppStateType = {
    NavBar: false
};

export default function(state = initialState, action: ActionType): AppStateType {
    if (action.type === "SET_NAVBAR") {
        return { ...state, NavBar: action.data };
    }

    return state;
}

import AlertType from '../types/AlertType';
import ActionType from '../types/ActionType';

const initialState: AlertType = {
    isVisible: false,
    type: "",
    text: "",
    timestamp: null
};

export default function(state = initialState, action: ActionType): AlertType {
    if (action.type === "SHOW_ALERT") {
        return { 
            isVisible: true,
            type: action.data.type,
            text: action.data.text,
            timestamp: `${new Date().getTime()}`
        };
    }

    if (action.type === "CLOSE_ALERT") {
        return { 
            isVisible: false,
            type: "",
            text: "",
            timestamp: state.timestamp
        };
    }

    return state;
}

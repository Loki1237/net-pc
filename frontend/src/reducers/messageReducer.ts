import ActionType from '../types/ActionType';
import DialogsType from '../types/DialogsType';

const initialState = {
    dialogList: [],
    selectedDialogUser: {},
    selectedDialogMessages: []
}

export default function(state: DialogsType = initialState, action: ActionType) {
    switch (action.type) {
        case "SET_DIALOG_LIST":
            return { 
                ...state, 
                dialogList: action.data 
            };

        case "SET_DEALOG_USER":
            return { 
                ...state, 
                selectedDialogUser: action.data, 
            };

        case "SET_DIALOG_MESSAGES":
            return { 
                ...state, 
                selectedDialogMessages: action.data
            };

        case "DIALOG_RESET":
            return { 
                ...state, 
                selectedDialogUser: {}, 
                selectedDialogMessages: [] 
            };
    }

    return state;
}

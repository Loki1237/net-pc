import {
    NoteState,
    NoteAction,
    NOTES_IS_LOADING,
    NOTES_ERROR,
    NOTES_SET_NOTE_LIST,
    NOTES_RESET_STATE
} from './types';

const initialState = {
    isLoading: false,
    error: "",
    noteList: []
}

export default function(state: NoteState = initialState, action: NoteAction): NoteState {
    switch (action.type) {
        case NOTES_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            };

        case NOTES_ERROR:
            return {
                ...state, 
                error: action.error
            };

        case NOTES_SET_NOTE_LIST:
            return {
                ...state,
                noteList: action.payload
            };

        case NOTES_RESET_STATE:
            return initialState;

        default:
            return state;
    }
}

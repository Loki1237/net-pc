import {
    NoteState,
    NoteAction,
    NOTES_IS_LOADING,
    NOTES_HAS_ERRORED,
    NOTES_SET_NOTE_LIST,
    NOTES_RESET_STATE
} from './types';

const initialState = {
    isLoading: false,
    hasErrored: false,
    noteList: []
}

export default function(state: NoteState = initialState, action: NoteAction): NoteState {
    switch (action.type) {
        case NOTES_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading || false
            };

        case NOTES_HAS_ERRORED:
            return {
                ...state, 
                hasErrored: action.hasErrored || false
            };

        case NOTES_SET_NOTE_LIST:
            return {
                ...state,
                noteList: action.payload || []
            };

        case NOTES_RESET_STATE:
            return initialState;

        default:
            return state;
    }
}

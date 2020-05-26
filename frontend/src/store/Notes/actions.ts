import { AppThunkAction } from '../thunk';
import { Dispatch } from 'redux';
import { 
    NoteAction, 
    Note,
    NOTES_IS_LOADING,
    NOTES_ERROR,
    NOTES_SET_NOTE_LIST,
    NOTES_RESET_STATE
} from './types';

export const notesIsLoading = (value: boolean): NoteAction => ({
    type: NOTES_IS_LOADING,
    isLoading: value
});

export const notesError = (value: string): NoteAction => ({
    type: NOTES_ERROR,
    error: value
});

export const notesSetNoteList = (payload: Note[]): NoteAction => ({
    type: NOTES_SET_NOTE_LIST,
    payload
});

export const notesResetState = (): NoteAction => ({
    type: NOTES_RESET_STATE
});

const getNotes = async () => {
    const response = await fetch('/api/notes');

    if (!response.ok) {
        throw Error(`${response.status} - ${response.statusText}`);
    }

    return await response.json();
}

export const updateNoteList = (): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(notesIsLoading(true));

        try {
            const notes = await getNotes();
            dispatch(notesIsLoading(false));
            dispatch(notesSetNoteList(notes));
        } catch(err) {
            dispatch(notesError(err.message));
        }
    };
}

export const createNote = (header: string, content: string): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        await fetch(`/api/notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charser=utf-8"
            },
            body: JSON.stringify({ header, content })
        });

        const notes = await getNotes();
        dispatch(notesSetNoteList(notes));
    };
}

export const changeNote = (header: string, content: string, id: number): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        await fetch(`/api/notes/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charser=utf-8"
            },
            body: JSON.stringify({ header, content })
        });

        const notes = await getNotes();
        dispatch(notesSetNoteList(notes));
    };
}

export const deleteNote = (id: number): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        await fetch(`api/notes/${id}`, { method: "DELETE" });
        
        const notes = await getNotes();
        dispatch(notesSetNoteList(notes));
    };
}

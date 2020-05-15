export const NOTES_IS_LOADING = "NOTES_IS_LOADING";
export const NOTES_HAS_ERRORED = "NOTES_HAS_ERRORED";
export const NOTES_SET_NOTE_LIST = "NOTES_SET_NOTE_LIST";
export const NOTES_RESET_STATE = "NOTES_RESET_STATE";

interface LoadingAction {
    type: typeof NOTES_IS_LOADING,
    isLoading: boolean,
};

interface ErroredAction {
    type: typeof NOTES_HAS_ERRORED,
    hasErrored: boolean,
};

interface SetNoteListAction {
    type: typeof NOTES_SET_NOTE_LIST,
    payload: Note[]
};

interface ResetStateAction {
    type: typeof NOTES_RESET_STATE
};

export type NoteAction = LoadingAction
                         | ErroredAction
                         | SetNoteListAction
                         | ResetStateAction;

export interface Note {
    id: number,
    userId: number,
    header: string,
    content: string
};

export interface NoteState {
    isLoading: boolean,
    hasErrored: boolean,
    noteList: Note[]
};

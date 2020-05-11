import { Action } from 'redux'
import { RootState } from '../index'
import { ThunkAction } from 'redux-thunk'

export interface NoteAction {
    type: string,
    isLoading?: boolean,
    hasErrored?: boolean,
    payload?: Note[]
};

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

export type DispatchNotes = (arg: NoteAction) => void;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const NOTES_IS_LOADING = "NOTES_IS_LOADING";
export const NOTES_HAS_ERRORED = "NOTES_HAS_ERRORED";
export const NOTES_SET_NOTE_LIST = "NOTES_SET_NOTE_LIST";
export const NOTES_RESET_STATE = "NOTES_RESET_STATE";

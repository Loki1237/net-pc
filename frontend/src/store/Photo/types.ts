import { Action } from 'redux'
import { RootState } from '../index'
import { ThunkAction } from 'redux-thunk'

export interface PhotoAction {
    type: string,
    isLoading?: boolean,
    hasErrored?: boolean,
    payload?: Photo[],
    owner?: { name: string, id: number }
};

export interface Photo {
    id: number,
    userId: number,
    url: string,
    timestamp: string
};

export interface PhotoState {
    isLoading: boolean,
    hasErrored: boolean,
    photoList: Photo[],
    owner: { name: string, id: number }
};

export type DispatchPhotos = (arg: PhotoAction) => void;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const PHOTOS_IS_LOADING = "PHOTOS_IS_LOADING";
export const PHOTOS_HAS_ERRORED = "PHOTOS_HAS_ERRORED";
export const PHOTOS_SET_PHOTO_LIST = "PHOTOS_SET_PHOTO_LIST";
export const PHOTOS_SET_OWNER = "PHOTOS_SET_OWNER";
export const PHOTOS_RESET_STATE = "PHOTOS_RESET_STATE";

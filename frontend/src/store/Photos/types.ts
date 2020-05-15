export const PHOTOS_IS_LOADING = "PHOTOS_IS_LOADING";
export const PHOTOS_HAS_ERRORED = "PHOTOS_HAS_ERRORED";
export const PHOTOS_SET_PHOTO_LIST = "PHOTOS_SET_PHOTO_LIST";
export const PHOTOS_SET_OWNER = "PHOTOS_SET_OWNER";
export const PHOTOS_RESET_STATE = "PHOTOS_RESET_STATE";

interface LoadingAction {
    type: typeof PHOTOS_IS_LOADING,
    isLoading: boolean,
};

interface ErroredAction {
    type: typeof PHOTOS_HAS_ERRORED,
    hasErrored: boolean,
};

interface SetPhotoListAction {
    type: typeof PHOTOS_SET_PHOTO_LIST,
    payload: Photo[]
};

interface SetPhotoOwnerAction {
    type: typeof PHOTOS_SET_OWNER,
    owner: { name: string, id: number }
};

interface ResetStateAction {
    type: typeof PHOTOS_RESET_STATE
};

export type PhotoAction = LoadingAction
                         | ErroredAction
                         | SetPhotoListAction
                         | SetPhotoOwnerAction
                         | ResetStateAction;

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

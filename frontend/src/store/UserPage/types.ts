import { Photo } from '../Photos/types';

export const USER_PAGE_IS_LOADING = "USER_PAGE_IS_LOADING";
export const USER_PAGE_HAS_ERRORED = "USER_PAGE_HAS_ERRORED";
export const USER_PAGE_SET_USER_DATA = "USER_PAGE_SET_USER_DATA";
export const USER_PAGE_SET_PHOTO_LIST = "USER_PAGE_SET_PHOTO_LIST";
export const USER_PAGE_RESET_STATE = "USER_PAGE_RESET_STATE";

interface LoadingAction {
    type: typeof USER_PAGE_IS_LOADING,
    isLoading: boolean,
};

interface ErroredAction {
    type: typeof USER_PAGE_HAS_ERRORED,
    hasErrored: boolean,
};

interface SetUserDataAction {
    type: typeof USER_PAGE_SET_USER_DATA,
    payload: User
};

interface SetPhotoListAction {
    type: typeof USER_PAGE_SET_PHOTO_LIST,
    payload: Photo[]
};

interface ResetStateAction {
    type: typeof USER_PAGE_RESET_STATE
};

export type UserPageAction = LoadingAction
                         | ErroredAction
                         | SetUserDataAction
                         | SetPhotoListAction
                         | ResetStateAction;

export interface User {
    id: number,
    name: string,
    email: string,
    gender: string,
    birthday: string,
    country: string,
    city: string,
    family_status: string,
    avatar: string,
    status: string,
    activity: string,
    interests: string,
    hobby: string,
    about_self: string;
};

export interface UserPageState {
    isLoading: boolean,
    hasErrored: boolean,
    currentUser: User,
    photoList: Photo[]
};

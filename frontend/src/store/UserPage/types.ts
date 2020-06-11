import { Photo } from '../Photos/types';

export const USER_PAGE_IS_LOADING = "USER_PAGE_IS_LOADING";
export const USER_PAGE_ERROR = "USER_PAGE_ERROR";
export const USER_PAGE_SET_USER_DATA = "USER_PAGE_SET_USER_DATA";
export const USER_PAGE_RESET_STATE = "USER_PAGE_RESET_STATE";

interface LoadingAction {
    type: typeof USER_PAGE_IS_LOADING,
    isLoading: boolean,
}

interface ErroredAction {
    type: typeof USER_PAGE_ERROR,
    error: string
}

interface SetUserDataAction {
    type: typeof USER_PAGE_SET_USER_DATA,
    payload: User
}

interface ResetStateAction {
    type: typeof USER_PAGE_RESET_STATE
}

export type UserPageAction = LoadingAction
                         | ErroredAction
                         | SetUserDataAction
                         | ResetStateAction

export interface Profile {
    gender: string,
    birthday: string,
    country: string,
    city: string,
    familyStatus: string,
    activity: string,
    interests: string,
    hobby: string,
    aboutSelf: string
}

export interface User {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    avatar: string,
    online: boolean,
    profile: Profile,
    photos: Photo[]
}

export interface UserPageState {
    isLoading: boolean,
    error: string,
    currentUser: User
}

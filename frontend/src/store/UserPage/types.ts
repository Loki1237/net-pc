import { Action } from 'redux'
import { RootState } from '../index'
import { ThunkAction } from 'redux-thunk'
import { Photo } from '../Photo/types';

export interface UserPageAction {
    type: string,
    isLoading?: boolean,
    hasErrored?: boolean,
    payload?: { user: User, photoList: Photo[] }
};

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

export type DispatchUserPage = (arg: UserPageAction) => void;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const USER_PAGE_IS_LOADING = "USER_PAGE_IS_LOADING";
export const USER_PAGE_HAS_ERRORED = "USER_PAGE_HAS_ERRORED";
export const USER_PAGE_SET_USER_DATA = "USER_PAGE_SET_USER_DATA";
export const USER_PAGE_RESET_STATE = "USER_PAGE_RESET_STATE";

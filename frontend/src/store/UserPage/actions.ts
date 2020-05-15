import { Photo } from '../Photos/types';
import { AppThunkAction } from '../thunk';
import { Dispatch } from 'redux';
import {
    UserPageAction,
    User,
    USER_PAGE_IS_LOADING,
    USER_PAGE_HAS_ERRORED,
    USER_PAGE_SET_USER_DATA,
    USER_PAGE_SET_PHOTO_LIST,
    USER_PAGE_RESET_STATE
} from './types';

export const userPageIsLoading = (value: boolean): UserPageAction => ({
    type: USER_PAGE_IS_LOADING,
    isLoading: value
})

export const userPageHasErrored = (value: boolean): UserPageAction => ({
    type: USER_PAGE_HAS_ERRORED,
    hasErrored: value
})

export const userPageSetUserData = (user: User): UserPageAction => ({
    type: USER_PAGE_SET_USER_DATA,
    payload: user
})

export const userPageSetPhotoList = (photo: Photo[]): UserPageAction => ({
    type: USER_PAGE_SET_PHOTO_LIST,
    payload: photo
})

export const userPageResetState = (): UserPageAction => ({
    type: USER_PAGE_RESET_STATE
})

const getUserData = async (id?: number) => {
    const response = await fetch(`/api/users/get_user_data/${id || ''}`);

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return await response.json();
}

const getPhotos = async (id?: number) => {
    const response = await fetch(`/api/photo/${id || ''}`);

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return await response.json();
}

export const updateUserData = (id: number): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(userPageIsLoading(true));

        try {
            if (!id) throw new Error();

            const user = await getUserData(id);
            const photoList = await getPhotos(id);

            dispatch(userPageIsLoading(false));
            dispatch(userPageSetUserData(user));
            dispatch(userPageSetPhotoList(photoList));
        } catch(error) {
            dispatch(userPageHasErrored(true));
        }
    };
}

export const changeAvatar = (file: FormData): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        await fetch(`/api/photo/upload_avatar`, {
            method: "POST",
            body: file
        });

        const user = await getUserData();
        const photoList = await getPhotos();
        dispatch(userPageSetUserData(user));
        dispatch(userPageSetPhotoList(photoList));
    };
}

export const resetAvatar = (): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        await fetch(`/api/users/set_avatar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ avatar: "" })
        });

        const user = await getUserData();
        const photoList = await getPhotos();
        dispatch(userPageSetUserData(user));
        dispatch(userPageSetPhotoList(photoList));
    };
}

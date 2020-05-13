import { Photo } from '../Photo/types';
import {
    UserPageAction,
    User,
    DispatchUserPage,
    AppThunk,
    USER_PAGE_IS_LOADING,
    USER_PAGE_HAS_ERRORED,
    USER_PAGE_SET_USER_DATA,
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

export const userPageSetUserData = (payload: { user: User, photoList: Photo[] }): UserPageAction => ({
    type: USER_PAGE_SET_USER_DATA,
    payload
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

export const updateUserData = (id: number): AppThunk => {
    return async (dispatch: DispatchUserPage) => {
        dispatch(userPageIsLoading(true));

        try {
            if (!id) throw new Error();

            const user = await getUserData(id);
            const photoList = await getPhotos(id);

            dispatch(userPageIsLoading(false));
            dispatch(userPageSetUserData({ user, photoList }));
        } catch(error) {
            dispatch(userPageHasErrored(true));
        }
    };
}

export const changeAvatar = (file: FormData): AppThunk => {
    return async (dispatch: DispatchUserPage) => {
        await fetch(`/api/photo/upload_avatar`, {
            method: "POST",
            body: file
        });

        const user = await getUserData();
        const photoList = await getPhotos();
        dispatch(userPageSetUserData({ user, photoList }));
    };
}

export const resetAvatar = (): AppThunk => {
    return async (dispatch: DispatchUserPage) => {
        await fetch(`/api/users/set_avatar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ avatar: "" })
        });

        const user = await getUserData();
        const photoList = await getPhotos();
        dispatch(userPageSetUserData({ user, photoList }));
    };
}

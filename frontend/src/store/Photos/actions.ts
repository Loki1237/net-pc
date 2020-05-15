import { AppThunkAction } from '../thunk';
import { Dispatch } from 'redux';
import {
    PhotoAction,
    Photo,
    PHOTOS_IS_LOADING,
    PHOTOS_HAS_ERRORED,
    PHOTOS_SET_PHOTO_LIST,
    PHOTOS_SET_OWNER,
    PHOTOS_RESET_STATE 
} from './types';

export const photosIsLoading = (value: boolean): PhotoAction => ({
    type: PHOTOS_IS_LOADING,
    isLoading: value
})

export const photosHasErrored = (value: boolean): PhotoAction => ({
    type: PHOTOS_HAS_ERRORED,
    hasErrored: value
})

export const photosSetBookmarkList = (payload: Photo[]): PhotoAction => ({
    type: PHOTOS_SET_PHOTO_LIST,
    payload
})

export const photosSetOwner = (owner: { name: string, id: number }): PhotoAction => ({
    type: PHOTOS_SET_OWNER,
    owner
})

export const photosResetState = (): PhotoAction => ({
    type: PHOTOS_RESET_STATE
})

const getPhotos = async (id?: number) => {
    const response = await fetch(`/api/photo/${id || ''}`);

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return await response.json();
}

export const updatePhotoList = (id: number): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(photosIsLoading(true));

        try {
            if (!id) throw new Error();

            const photos = await getPhotos(id);
            const resUserData = await fetch(`/api/users/get_user_data/${id}`);
            const userData = await resUserData.json();

            dispatch(photosIsLoading(false));
            dispatch(photosSetBookmarkList(photos));
            dispatch(photosSetOwner({ name: userData.name, id: userData.id }));
        } catch {
            dispatch(photosHasErrored(true));
        }
    };
}

export const createPhotos = (files: FormData): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        await fetch(`/api/photo/multiple`, {
            method: "POST",
            body: files
        });

        const photos = await getPhotos();
        dispatch(photosSetBookmarkList(photos));
    };
}

export const deletePhoto = (id: number): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        await fetch(`/api/photo/${id}`, { method: "DELETE" });
        
        const photos = await getPhotos();
        dispatch(photosSetBookmarkList(photos));
    };
}

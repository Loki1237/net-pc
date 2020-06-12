import { history } from '../../middleware';
import { AppThunkAction } from '../thunk';
import { Dispatch } from 'redux';
import {
    UserPageAction,
    User,
    USER_PAGE_IS_LOADING,
    USER_PAGE_ERROR,
    USER_PAGE_SET_USER_DATA,
    USER_PAGE_SET_PAGE_OWNER,
    USER_PAGE_RESET_STATE
} from './types';

export const userPageIsLoading = (value: boolean): UserPageAction => ({
    type: USER_PAGE_IS_LOADING,
    isLoading: value
});

export const userPageError = (value: string): UserPageAction => ({
    type: USER_PAGE_ERROR,
    error: value
});

export const userPageSetUserData = (user: User): UserPageAction => ({
    type: USER_PAGE_SET_USER_DATA,
    payload: user
});

export const userPageSetPageOwner = (owner: "i" | "friend" | "any" | undefined): UserPageAction => ({
    type: USER_PAGE_SET_PAGE_OWNER,
    owner
});

export const userPageResetState = (): UserPageAction => ({
    type: USER_PAGE_RESET_STATE
});

const getUserPage = async (id?: number) => {
    const response = await fetch(`/api/users/get_user_data/${id || ''}`);

    if (!response.ok) {
        throw Error(`${response.status} - ${response.statusText}`);
    }

    return await response.json();
}

export const updateUserData = (id: number): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(userPageIsLoading(true));

        try {
            const page = await getUserPage(id);

            dispatch(userPageIsLoading(false));
            dispatch(userPageSetUserData(page.user));
            dispatch(userPageSetPageOwner(page.owner));
        } catch(err) {
            dispatch(userPageError(err.message));
        }
    };
}

export const changeAvatar = (file: FormData): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        await fetch(`/api/photo/upload_avatar`, {
            method: "POST",
            body: file
        });

        const page = await getUserPage();
        dispatch(userPageSetUserData(page.user));
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

        const page = await getUserPage();
        dispatch(userPageSetUserData(page.user));
    };
}

export const createDialog = (userId: number): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        const response = await fetch(`/api/messages/create_dialog/${userId}`, { method: "POST" });

        if (response.ok) {
            const conversation = await response.json();
            history.push(`/messages/${conversation.id}`);
        }
    };
}

import { AppThunkAction } from '../thunk';
import { Dispatch } from 'redux';
import { toast as notify } from 'react-toastify';
import { 
    EditionAction,
    BasicDataType,
    AboutSelfType,
    EDITING_IS_LOADING,
    EDITING_ERROR,
    EDITING_EDIT_BASIC_DATA,
    EDITING_EDIT_ABOUT_SELF_DATA,
    EDITING_SET_ALL_DATA,
    EDITING_RESET_STATE
} from './types';

export const editingIsLoading = (value: boolean): EditionAction => ({
    type: EDITING_IS_LOADING,
    isLoading: value
});

export const editingError = (value: string): EditionAction => ({
    type: EDITING_ERROR,
    error: value
});

export const editingEditBasicData = (fieldName: string, payload: string): EditionAction => ({
    type: EDITING_EDIT_BASIC_DATA,
    fieldName,
    payload
});

export const editingEditAboutSelfData = (fieldName: string, payload: string): EditionAction => ({
    type: EDITING_EDIT_ABOUT_SELF_DATA,
    fieldName,
    payload
});

export const editingSetAllData = (basicData: BasicDataType, aboutSelfData: AboutSelfType): EditionAction => ({
    type: EDITING_SET_ALL_DATA,
    basicData,
    aboutSelfData
});

export const editingResetState = (): EditionAction => ({
    type: EDITING_RESET_STATE
});

export const getUserData = (): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(editingIsLoading(true));

        try {
            const response = await fetch(`/api/users/get_user_data`);

            if (!response.ok) {
                throw Error(`${response.status} - ${response.statusText}`);
            }

            const userData = await response.json();
            const name = userData.name.split(" ");

            const basicData = {
                firstName: name[0],
                lastName: name[1],
                birthday: userData.birthday,
                familyStatus: userData.family_status,
                country: userData.country,
                city: userData.city
            };
            
            const aboutSelfData = {
                activity: userData.activity,
                interests: userData.interests,
                hobby: userData.hobby,
                aboutSelf: userData.about_self
            };

            dispatch(editingIsLoading(false));
            dispatch(editingSetAllData(basicData, aboutSelfData));
        } catch(e) {
            dispatch(editingError(e.message));
        }
    };
}

export const saveBasicData = (data: BasicDataType): AppThunkAction => {
    return async () => {
        const res = await fetch(`/api/users/change_basic_info`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charser=utf-8"
            },
            body: JSON.stringify(data)
        });
 
        if (res.status === 200) {
            notify.success("Данные сохранены");
        } else {
            const resParse = await res.json();
            notify.error(resParse.error);
        }
    };
}

export const saveAboutSelfData = (data: AboutSelfType): AppThunkAction => {
    return async () => {
        const res = await fetch(`/api/users/change_about_self_info`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charser=utf-8"
            },
            body: JSON.stringify(data)
        });

        if (res.status === 200) {
            notify.success("Данные сохранены");
        } else {
            const resParse = await res.json();
            notify.error(resParse.error);
        }
    };
}

export const saveEmail = (newEmail: string): AppThunkAction => {
    return async () => {
        const res = await fetch(`/api/auth/change_email`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charser=utf-8"
            },
            body: JSON.stringify({
                newEmail
            })
        });

        if (res.status === 200) {
            notify.success("Новый e-mail успешно сохранён");
        } else {
            notify.error(res.statusText);
        }
    };
}

export const savePassword = (password: { oldPassword: string, newPassword: string }): AppThunkAction => {
    return async () => {
        const res = await fetch(`/api/auth/change_password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charser=utf-8"
            },
            body: JSON.stringify(password)
        });

        if (res.status === 200) {
            notify.success("Новый пароль успешно сохранён");
        } else {
            notify.error(res.statusText);
        }
    };
}

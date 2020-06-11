import { AppThunkAction } from '../thunk';
import { Dispatch } from 'redux';
import { toast as notify } from 'react-toastify';
import { history } from '../../middleware';
import { appUserLogIn } from '../../store/App/actions';
import { 
    AuthAction,
    SignUpUserData,
    AUTH_LOG_IN_LOADING,
    AUTH_SIGN_UP_LOADING,
    AUTH_ERROR,
    AUTH_RESET_STATE
} from './types';

export const authLogInLoading = (value: boolean): AuthAction => ({
    type: AUTH_LOG_IN_LOADING,
    logInLoading: value
});

export const authSignUpLoading = (value: boolean): AuthAction => ({
    type: AUTH_SIGN_UP_LOADING,
    signUpLoading: value
});

export const authError = (value: string): AuthAction => ({
    type: AUTH_ERROR,
    error: value
});

export const authResetState = (): AuthAction => ({
    type: AUTH_RESET_STATE
});

export const logIn = (email: string, password: string): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(authLogInLoading(true));

        try {
            const response = await fetch('/api/auth/login', { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charser=utf-8"
                },
                body: JSON.stringify({ email, password })
            });

            dispatch(authLogInLoading(false));
            
            if (response.status === 200) {
                const user = await response.json();
                dispatch(appUserLogIn(user.id));
                
                history.push(`/usr/${user.id}`);
            } else {
                notify.error("Неверно введён email или пароль");
                throw Error(`${response.status} - ${response.statusText}`);
            }
        } catch(e) {
            dispatch(authError(e.message));
        }
    }
}

export const signUp = (data: SignUpUserData): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(authSignUpLoading(true));

        try {
            const response = await fetch('/api/auth/sign-up', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charser=utf-8"
                },
                body: JSON.stringify(data)
            });
            
            dispatch(authSignUpLoading(false));
            
            if (response.status === 200) {
                notify.success(`Пользователь ${data.firstName} ${data.lastName} успешно зарегестрирован`);
                history.push('/auth/sign-in');
            } else {
                const result = await response.json();
                notify.error(result.error);
                throw Error(`${response.status} - ${response.statusText}`);
            }
        } catch(e) {
            dispatch(authError(e.message));
        }
    }
}


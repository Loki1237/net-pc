export const AUTH_LOG_IN_LOADING = "AUTH_LOG_IN_LOADING";
export const AUTH_SIGN_UP_LOADING = "AUTH_SIGN_UP_LOADING";
export const AUTH_ERROR = "EDITION_ERROR";
export const AUTH_RESET_STATE = "EDITION_RESET_STATE";

interface SignInLoadingAction {
    type: typeof AUTH_LOG_IN_LOADING,
    logInLoading: boolean,
}

interface SignUpLoadingAction {
    type: typeof AUTH_SIGN_UP_LOADING,
    signUpLoading: boolean,
}

interface ErrorAction {
    type: typeof AUTH_ERROR,
    error: string,
}

interface ResetAction {
    type: typeof AUTH_RESET_STATE
}

export type AuthAction = SignInLoadingAction
                         | SignUpLoadingAction
                         | ErrorAction
                         | ResetAction

export interface SignUpUserData {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    country: string,
    city: string,
    gender: string,
    birthday: string
}

export interface AuthState {
    logInLoading: boolean,
    signUpLoading: boolean,
    error: string
}

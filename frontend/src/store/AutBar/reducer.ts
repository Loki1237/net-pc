import {
    AuthState,
    AuthAction,
    AUTH_LOG_IN_LOADING,
    AUTH_SIGN_UP_LOADING,
    AUTH_ERROR,
    AUTH_RESET_STATE
} from './types';

const initialState = {
    logInLoading: false,
    signUpLoading: false,
    error: ""
}

export default function(state: AuthState = initialState, action: AuthAction): AuthState {
    switch (action.type) {
        case AUTH_LOG_IN_LOADING:
            return {
                ...state,
                logInLoading: action.logInLoading
            };

        case AUTH_SIGN_UP_LOADING:
            return {
                ...state,
                signUpLoading: action.signUpLoading
            };

        case AUTH_ERROR:
            return {
                ...state,
                error: action.error
            };

        case AUTH_RESET_STATE:
            return initialState;

        default:
            return state;
    }
}

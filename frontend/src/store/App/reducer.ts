import {
    AppState,
    AppAction,
    APP_USER_LOG_IN,
    APP_USER_LOG_OUT
} from './types';

const initialState = {
    userIsLogged: false,
    userId: 0
}

export default function(state: AppState = initialState, action: AppAction): AppState {
    switch (action.type) {
        case APP_USER_LOG_IN:
            return {
                userIsLogged: !!action.id,
                userId: action.id
            };

        case APP_USER_LOG_OUT:
            return {
                userIsLogged: false,
                userId: 0
            };

        default:
            return state;
    }
}

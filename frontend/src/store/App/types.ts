export const APP_USER_LOG_IN = "APP_USER_LOG_IN";
export const APP_USER_LOG_OUT = "APP_USER_LOG_OUT";

interface LoginAction {
    type: typeof APP_USER_LOG_IN,
    id: number
}

interface LogoutAction {
    type: typeof APP_USER_LOG_OUT
}

export type AppAction = LoginAction | LogoutAction;

export interface AppState {
    userIsLogged: boolean,
    userId: number 
}

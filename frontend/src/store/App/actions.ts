import { AppThunkAction } from '../thunk';
import { Dispatch } from 'redux';
import { history } from '../../middleware';
import { 
    AppAction,
    APP_USER_LOG_IN,
    APP_USER_LOG_OUT
} from './types';

export const appUserLogIn = (id: number): AppAction => ({
    type: APP_USER_LOG_IN,
    id
});

export const appUserLogOut = (): AppAction => ({
    type: APP_USER_LOG_OUT
});

export const logInAs = (): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        const response = await fetch('/api/auth/login-as', { method: "POST" });

        if (response.status === 200) {
            const user = await response.json();
            const validPaths = /^\/(messages|music|bookmarks|notes|search)$|\/edit|\/usr|\/photo|\/friends/;
            
            dispatch(appUserLogIn(user.id));

            if (!validPaths.test(history.location.pathname)) {
                history.push(`/usr/${user.id}`);
            }
        } else {
            history.push('/auth/sign-in');
        }
    }
}

export const logOut = (): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        const res = await fetch('/api/auth/logout', { method: "HEAD" });

        if (res.status === 200) {
            history.push('/auth');
            dispatch(appUserLogOut());
        } else {
            console.log(res.status);
        }
    }
}

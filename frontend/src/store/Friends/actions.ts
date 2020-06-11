import { AppThunkAction } from '../thunk';
import { Dispatch } from 'redux';
import {
    User,
    InRequest,
    OutRequest,
    FriendAction,
    FRIENDS_IS_LOADING,
    FRIENDS_ERROR,
    FRIENDS_SET_FRIEND_LIST,
    FRIENDS_SET_IN_REQUEST_LIST,
    FRIENDS_SET_OUT_REQUEST_LIST,
    FRIENDS_RESET_STATE
} from './types';

export const friendsIsLoading = (value: boolean): FriendAction => ({
    type: FRIENDS_IS_LOADING,
    isLoading: value
});

export const friendsError = (value: string): FriendAction => ({
    type: FRIENDS_ERROR,
    error: value
});

export const friendsSetFriendList = (payload: User[]): FriendAction => ({
    type: FRIENDS_SET_FRIEND_LIST,
    payload
});

export const friendsSetInRequestList = (payload: InRequest[]): FriendAction => ({
    type: FRIENDS_SET_IN_REQUEST_LIST,
    payload
});

export const friendsSetOutRequestList = (payload: OutRequest[]): FriendAction => ({
    type: FRIENDS_SET_OUT_REQUEST_LIST,
    payload
});

export const friendsResetState = (): FriendAction => ({
    type: FRIENDS_RESET_STATE
});

const getFriends = async () => {
    const response = await fetch('/api/friends/all');

    if (!response.ok) {
        throw Error(`${response.status} - ${response.statusText}`);
    }

    return await response.json();
}

const getFriendRequests = async (category: string) => {
    const response = await fetch(`/api/friends/requests/${category}`);

    if (!response.ok) {
        throw Error(`${response.status} - ${response.statusText}`);
    }

    return await response.json();
}

export const updateFriendList = (): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(friendsIsLoading(true));

        try {
            const friendRequests = await getFriends();
            const friends: User[] = [];

            for (let request of friendRequests) {
                if (request.user1) {
                    friends.push(request.user1);
                } else if (request.user2) {
                    friends.push(request.user2);
                }
            }

            dispatch(friendsIsLoading(false));
            dispatch(friendsSetFriendList(friends));
        } catch(err) {
            dispatch(friendsError(err.message));
        }
    };
}

export const updateInRequestList = (): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(friendsIsLoading(true));

        try {
            const request = await getFriendRequests('in');

            dispatch(friendsIsLoading(false));
            dispatch(friendsSetInRequestList(request));
        } catch(err) {
            dispatch(friendsError(err.message));
        }
    };
}

export const updateOutRequestList = (): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(friendsIsLoading(true));

        try {
            const request = await getFriendRequests('out');

            dispatch(friendsIsLoading(false));
            dispatch(friendsSetOutRequestList(request));
        } catch(err) {
            dispatch(friendsError(err.message));
        }
    };
}

export const sendFriendRequest = (userId: number): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        const response = await fetch(`/api/friends/${userId}`, { method: "POST" });

        if (response.ok) {

        }
    };
}

export const confirmRequest = (id: number): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        const response = await fetch(`/api/friends/${id}`, { method: "PUT" });

        if (response.ok) {

        }
    };
}

export const deleteRequest = (id: number): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        const response = await fetch(`/api/friends/${id}`, { method: "DELETE" });

        if (response.ok) {

        }
    };
}

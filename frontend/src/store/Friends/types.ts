export const FRIENDS_IS_LOADING = "NOTES_IS_LOADING";
export const FRIENDS_ERROR = "NOTES_ERROR";
export const FRIENDS_SET_FRIEND_LIST = "FRIENDS_SET_FRIEND_LIST";
export const FRIENDS_SET_IN_REQUEST_LIST = "FRIENDS_SET_IN_REQUEST_LIST";
export const FRIENDS_SET_OUT_REQUEST_LIST = "FRIENDS_SET_OUT_REQUEST_LIST";
export const FRIENDS_RESET_STATE = "NOTES_RESET_STATE";

interface LoadingAction {
    type: typeof FRIENDS_IS_LOADING,
    isLoading: boolean,
}

interface ErroredAction {
    type: typeof FRIENDS_ERROR,
    error: string,
}

interface SetFriendListAction {
    type: typeof FRIENDS_SET_FRIEND_LIST,
    payload: User[]
}

interface SetInRequestListAction {
    type: typeof FRIENDS_SET_IN_REQUEST_LIST,
    payload: InRequest[]
}

interface SetOutRequestListAction {
    type: typeof FRIENDS_SET_OUT_REQUEST_LIST,
    payload: OutRequest[]
}

interface ResetStateAction {
    type: typeof FRIENDS_RESET_STATE
}

export type FriendAction = LoadingAction
                         | ErroredAction
                         | SetFriendListAction
                         | SetInRequestListAction
                         | SetOutRequestListAction
                         | ResetStateAction

export interface User {
    id: number,
    firstName: string,
    lastName: string,
    avatar: string,
    online: boolean
}

export interface InRequest {
    id: number,
    user1: User
}

export interface OutRequest {
    id: number,
    user2: User
}

export interface FriendState {
    isLoading: boolean,
    error: string,
    friendList: User[],
    inRequestList: InRequest[],
    outRequestList: OutRequest[]
}

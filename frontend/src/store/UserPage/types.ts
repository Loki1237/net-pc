export interface Action {
    type: string,
    payload: string
};

export interface UserPageState {
    avatar: string
}

export const SET_AVATAR = "SET_AVATAR";
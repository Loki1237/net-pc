export const SET_SEARCHED_USER_LIST = "SET_SEARCHED_USER_LIST";

export interface Action {
    type: string,
    payload: SearchedUser[]
};

export interface SearchedUser {
    id: number,
    name: string,
    country: string,
    city: string,
    avatar: string
    status: string
}

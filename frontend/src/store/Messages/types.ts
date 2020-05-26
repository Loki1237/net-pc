export const MESSAGES_IS_LOADING = "MESSAGES_IS_LOADING";
export const MESSAGES_ERROR = "MESSAGES_ERROR";
export const MESSAGES_SET_USER_LIST = "MESSAGES_SET_USER_LIST";
export const MESSAGES_SET_CURRENT_USER = "MESSAGES_SET_CURRENT_USER";
export const MESSAGES_SET_MESSAGE_LIST = "MESSAGES_SET_MESSAGE_LIST";
export const MESSAGES_ADD_MESSAGE_IN_LIST = "MESSAGES_ADD_MESSAGE_IN_LIST";
export const MESSAGES_RESET_CURRENT_USER = "MESSAGES_RESET_CURRENT_USER";
export const MESSAGES_RESET_STATE = "MESSAGES_RESET_STATE";

interface LoadingAction {
    type: typeof MESSAGES_IS_LOADING,
    isLoading: boolean,
}

interface ErroredAction {
    type: typeof MESSAGES_ERROR,
    error: string,
}

interface SetUserListAction {
    type: typeof MESSAGES_SET_USER_LIST,
    payload: User[],
}

interface SetCurrentUserAction {
    type: typeof MESSAGES_SET_CURRENT_USER,
    payload: User,
}

interface SetMessageListAction {
    type: typeof MESSAGES_SET_MESSAGE_LIST,
    payload: Message[],
}

interface AddMessageAction {
    type: typeof MESSAGES_ADD_MESSAGE_IN_LIST,
    payload: Message,
}

interface ResetAction {
    type: typeof MESSAGES_RESET_CURRENT_USER | typeof MESSAGES_RESET_STATE
}

export type MessageAction = LoadingAction 
                            | ErroredAction 
                            | SetUserListAction 
                            | SetCurrentUserAction 
                            | SetMessageListAction
                            | AddMessageAction
                            | ResetAction

export interface Message {
    id: number,
    userId: number,
    targetId: number,
    content: string,
    timestamp: string
}

export interface User {
    id: number,
    name: string,
    avatar: string,
    status: string
}

export interface MessageState {
    isLoading: boolean,
    error: string,
    userList: User[],
    messageList: Message[],
    currentUser: User
}

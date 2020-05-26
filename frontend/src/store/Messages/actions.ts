import { AppThunkAction } from '../thunk';
import { Dispatch } from 'redux';
import { 
    MessageAction,
    User,
    Message,
    MESSAGES_IS_LOADING,
    MESSAGES_ERROR,
    MESSAGES_SET_USER_LIST,
    MESSAGES_SET_CURRENT_USER,
    MESSAGES_SET_MESSAGE_LIST,
    MESSAGES_ADD_MESSAGE_IN_LIST,
    MESSAGES_RESET_CURRENT_USER,
    MESSAGES_RESET_STATE
} from './types';

export const messagesIsLoading = (value: boolean): MessageAction => ({
    type: MESSAGES_IS_LOADING,
    isLoading: value
});

export const messagesError = (value: string): MessageAction => ({
    type: MESSAGES_ERROR,
    error: value
});

export const messagesSetUserList = (users: User[]): MessageAction => ({
    type: MESSAGES_SET_USER_LIST,
    payload: users
});

export const messagesSetCurrentUser = (user: User): MessageAction => ({
    type: MESSAGES_SET_CURRENT_USER,
    payload: user
});

export const messagesSetMessageList = (messages: Message[]): MessageAction => ({
    type: MESSAGES_SET_MESSAGE_LIST,
    payload: messages
});

export const addMessageInList = (message: Message): MessageAction => ({
    type: MESSAGES_ADD_MESSAGE_IN_LIST,
    payload: message
});


export const messagesResetCurrentUser = (): MessageAction => ({
    type: MESSAGES_RESET_CURRENT_USER
});

export const messagesResetState = (): MessageAction => ({
    type: MESSAGES_RESET_STATE
});

const getUsers = async () => {
    const response = await fetch('/api/messages/get_users');

    if (!response.ok) {
        throw Error(`${response.status} - ${response.statusText}`);
    }

    return await response.json();
}

const getMessages = async (targetId: number) => {
    const response = await fetch(`/api/messages/get_messages/${targetId}`);

    if (!response.ok) {
        throw Error(`${response.status} - ${response.statusText}`);
    }

    return await response.json();
}

export const updateUserList = (): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(messagesIsLoading(true));

        try {
            const users = await getUsers();
            dispatch(messagesIsLoading(false));
            dispatch(messagesSetUserList(users));
        } catch(err) {
            dispatch(messagesError(err.message));
        }
    };
}

export const selectDialog = (user: User): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        try {
            const messages = await getMessages(user.id);
            dispatch(messagesSetCurrentUser(user));
            dispatch(messagesSetMessageList(messages));
        } catch(err) {
            dispatch(messagesError(err.message));
        }
    };
}

export const sendMessage = (targetId: number, content: string): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        const response = await fetch('/api/messages/send', {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({ targetId, content })
        });
        const message = await response.json();

        dispatch(addMessageInList(message));
    };
}

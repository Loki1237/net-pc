import { AppThunkAction } from '../thunk';
import { Dispatch } from 'redux';
import { 
    MessageAction,
    Conversation,
    Message,
    User,
    MESSAGES_IS_LOADING,
    MESSAGES_ERROR,
    MESSAGES_SET_CONVERSATION_LIST,
    MESSAGES_SET_CURRENT_CONVERSATION,
    MESSAGES_SET_MESSAGE_LIST,
    MESSAGES_SET_FRIEND_LIST,
    MESSAGES_CLEAR_FRIEND_LIST,
    MESSAGES_ADD_MESSAGE_IN_LIST,
    MESSAGES_UPDATE_PARTICIPANT_LIST,
    MESSAGES_RESET_CURRENT_CONVERSATION,
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

export const messagesSetConversationList = (conversations: Conversation[]): MessageAction => ({
    type: MESSAGES_SET_CONVERSATION_LIST,
    payload: conversations
});

export const messagesSetCurrentConversation  = (user: Conversation): MessageAction => ({
    type: MESSAGES_SET_CURRENT_CONVERSATION,
    payload: user
});

export const messagesSetMessageList = (messages: Message[]): MessageAction => ({
    type: MESSAGES_SET_MESSAGE_LIST,
    payload: messages
});

export const messagesSetFriendList = (users: User[]): MessageAction => ({
    type: MESSAGES_SET_FRIEND_LIST,
    payload: users
});

export const messagesClearFriendList = (): MessageAction => ({
    type: MESSAGES_CLEAR_FRIEND_LIST
});

export const messagesAddMessageInList = (message: Message): MessageAction => ({
    type: MESSAGES_ADD_MESSAGE_IN_LIST,
    payload: message
});

export const messagesUpdateParticipantsList = (participants: User[]): MessageAction => ({
    type: MESSAGES_UPDATE_PARTICIPANT_LIST,
    payload: participants
})

export const messagesResetCurrentConversation = (): MessageAction => ({
    type: MESSAGES_RESET_CURRENT_CONVERSATION
});

export const messagesResetState = (): MessageAction => ({
    type: MESSAGES_RESET_STATE
});

const getConversations = async () => {
    const response = await fetch('/api/messages/get_conversations');

    if (!response.ok) {
        throw Error(`${response.status} - ${response.statusText}`);
    }

    return await response.json();
}

const getMessages = async (conversationId: number) => {
    const response = await fetch(`/api/messages/get_messages/${conversationId}`);

    if (!response.ok) {
        throw Error(`${response.status} - ${response.statusText}`);
    }

    return await response.json();
}

export const updateConversationList = (): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(messagesIsLoading(true));

        try {
            const conversations = await getConversations();

            for (let conversation of conversations) {
                const response = await fetch(`/api/messages/get_last_message/${conversation.id}`);
                const messages = await response.json();

                conversation.lastMessage = messages[0] || null;
            }

            dispatch(messagesIsLoading(false));
            dispatch(messagesSetConversationList(conversations));
        } catch(err) {
            dispatch(messagesError(err.message));
        }
    };
}

export const selectConversation = (conversation: Conversation): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        try {
            const messages = await getMessages(conversation.id);
            dispatch(messagesSetCurrentConversation(conversation));
            dispatch(messagesSetMessageList(messages));
        } catch(err) {
            dispatch(messagesError(err.message));
        }
    };
}

export const setFriendList = (): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        const response = await fetch('/api/friends/all');
        const friendRequests = await response.json();

        const friends: User[] = [];

        for (let request of friendRequests) {
            if (request.user1) {
                friends.push(request.user1);
            } else if (request.user2) {
                friends.push(request.user2);
            }
        }

        dispatch(messagesSetFriendList(friends));
    };
}

export const addParticipants = (conversationId: number, users: { id: number }[]): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        const response = await fetch(`/api/messages/add_users_to_chat/${conversationId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({ users })
        });
        const participants = await response.json();
        
        dispatch(messagesUpdateParticipantsList(participants))
    };
}

export const deleteParticipant = (conversationId: number, userId: number): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        const response = await fetch(`/api/messages/delete_participant/${conversationId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({ userId })
        });
        const participants = await response.json();
        
        dispatch(messagesUpdateParticipantsList(participants))
    };
}

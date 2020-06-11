export const MESSAGES_IS_LOADING = "MESSAGES_IS_LOADING";
export const MESSAGES_ERROR = "MESSAGES_ERROR";
export const MESSAGES_SET_CONVERSATION_LIST = "MESSAGES_SET_CONVERSATION_LIST";
export const MESSAGES_SET_CURRENT_CONVERSATION = "MESSAGES_SET_CURRENT_CONVERSATION";
export const MESSAGES_SET_MESSAGE_LIST = "MESSAGES_SET_MESSAGE_LIST";
export const MESSAGES_SET_FRIEND_LIST = "MESSAGES_SET_FRIEND_LIST";
export const MESSAGES_CLEAR_FRIEND_LIST = "MESSAGES_CLEAR_FRIEND_LIST";
export const MESSAGES_ADD_MESSAGE_IN_LIST = "MESSAGES_ADD_MESSAGE_IN_LIST";
export const MESSAGES_UPDATE_PARTICIPANT_LIST = "MESSAGES_UPDATE_PARTICIPANT_LIST";
export const MESSAGES_RESET_CURRENT_CONVERSATION = "MESSAGES_RESET_CURRENT_CONVERSATION";
export const MESSAGES_RESET_STATE = "MESSAGES_RESET_STATE";

interface LoadingAction {
    type: typeof MESSAGES_IS_LOADING,
    isLoading: boolean,
}

interface ErroredAction {
    type: typeof MESSAGES_ERROR,
    error: string,
}

interface SetConversationListAction {
    type: typeof MESSAGES_SET_CONVERSATION_LIST,
    payload: Conversation[],
}

interface SetCurrentConversationAction {
    type: typeof MESSAGES_SET_CURRENT_CONVERSATION,
    payload: Conversation,
}

interface SetMessageListAction {
    type: typeof MESSAGES_SET_MESSAGE_LIST,
    payload: Message[],
}

interface SetFriendListAction {
    type: typeof MESSAGES_SET_FRIEND_LIST,
    payload: User[],
}

interface ClearFriendListAction {
    type: typeof MESSAGES_CLEAR_FRIEND_LIST
}

interface AddMessageAction {
    type: typeof MESSAGES_ADD_MESSAGE_IN_LIST,
    payload: Message,
}

interface UpdateParticipantList {
    type: typeof MESSAGES_UPDATE_PARTICIPANT_LIST,
    payload: User[]
}

interface ResetAction {
    type: typeof MESSAGES_RESET_CURRENT_CONVERSATION | typeof MESSAGES_RESET_STATE
}

export type MessageAction = LoadingAction 
                            | ErroredAction 
                            | SetConversationListAction 
                            | SetCurrentConversationAction 
                            | SetMessageListAction
                            | SetFriendListAction
                            | ClearFriendListAction
                            | UpdateParticipantList
                            | AddMessageAction
                            | ResetAction

export interface Message {
    id: number,
    conversationId: number,
    text: string,
    wasRead: boolean,
    timestamp: string,
    author: {
        id: number,
        firstName: string,
        lastName: string
    }
}

export interface User {
    id: number,
    firstName: string,
    lastName: string,
    avatar: string,
    online: boolean
}

export interface Conversation {
    id: number,
    creatorId: number,
    isDialog: boolean,
    name: string,
    timestamp: Date,
    participants: User[],
    lastMessage: Message
}

export interface MessageState {
    isLoading: boolean,
    error: string,
    conversations: Conversation[],
    messageList: Message[],
    friendList: User[],
    currentConversation: Conversation | null
}

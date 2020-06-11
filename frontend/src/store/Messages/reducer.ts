import {
    MessageState,
    MessageAction,
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

const initialState = {
    isLoading: false,
    error: "",
    conversations: [],
    messageList: [],
    friendList: [],
    currentConversation: null
}

export default function(state: MessageState = initialState, action: MessageAction): MessageState {
    switch (action.type) {
        case MESSAGES_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            };

        case MESSAGES_ERROR:
            return {
                ...state, 
                error: action.error
            };

        case MESSAGES_SET_CONVERSATION_LIST:
            return {
                ...state,
                conversations: action.payload
            };

        case MESSAGES_SET_CURRENT_CONVERSATION:
            return {
                ...state,
                currentConversation: action.payload
            };

        case MESSAGES_SET_MESSAGE_LIST:
            return {
                ...state,
                messageList: action.payload
            };
            
        case MESSAGES_SET_FRIEND_LIST:
            return {
                ...state,
                friendList: action.payload
            };

        case MESSAGES_CLEAR_FRIEND_LIST:
            return {
                ...state,
                friendList: initialState.friendList
            };

        case MESSAGES_ADD_MESSAGE_IN_LIST:
            return {
                ...state,
                messageList: [...state.messageList, action.payload]
            };

        case MESSAGES_UPDATE_PARTICIPANT_LIST:
            if (state.currentConversation) {
                return {
                    ...state,
                    currentConversation: {
                        ...state.currentConversation,
                        participants: action.payload
                    }
                };
            } else {
                return state;
            }

        case MESSAGES_RESET_CURRENT_CONVERSATION:
            return {
                ...state,
                messageList: [],
                currentConversation: null
            };

        case MESSAGES_RESET_STATE:
            return initialState;

        default:
            return state;
    }
}

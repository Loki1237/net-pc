import {
    MessageState,
    MessageAction,
    MESSAGES_IS_LOADING,
    MESSAGES_HAS_ERRORED,
    MESSAGES_SET_USER_LIST,
    MESSAGES_SET_CURRENT_USER,
    MESSAGES_SET_MESSAGE_LIST,
    MESSAGES_ADD_MESSAGE_IN_LIST,
    MESSAGES_RESET_CURRENT_USER,
    MESSAGES_RESET_STATE
} from './types';

const initialState = {
    isLoading: false,
    hasErrored: false,
    userList: [],
    messageList: [],
    currentUser: {
        id: 0,
        name: "",
        avatar: "",
        status: ""
    }
}

export default function(state: MessageState = initialState, action: MessageAction): MessageState {
    switch (action.type) {
        case MESSAGES_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            };

        case MESSAGES_HAS_ERRORED:
            return {
                ...state, 
                hasErrored: action.hasErrored
            };

        case MESSAGES_SET_USER_LIST:
            return {
                ...state,
                userList: action.payload
            };

        case MESSAGES_SET_CURRENT_USER:
            return {
                ...state,
                currentUser: action.payload
            };

        case MESSAGES_SET_MESSAGE_LIST:
            return {
                ...state,
                messageList: action.payload
            };

        case MESSAGES_ADD_MESSAGE_IN_LIST:
            return {
                ...state,
                messageList: [...state.messageList, action.payload]
            };

        case MESSAGES_RESET_CURRENT_USER:
            return {
                ...state,
                messageList: [],
                currentUser: initialState.currentUser
            };

        case MESSAGES_RESET_STATE:
            return initialState;

        default:
            return state;
    }
}

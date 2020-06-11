import {
    FriendState,
    FriendAction,
    FRIENDS_IS_LOADING,
    FRIENDS_ERROR,
    FRIENDS_SET_FRIEND_LIST,
    FRIENDS_SET_IN_REQUEST_LIST,
    FRIENDS_SET_OUT_REQUEST_LIST,
    FRIENDS_RESET_STATE
} from './types';

const initialState = {
    isLoading: false,
    error: "",
    friendList: [],
    inRequestList: [],
    outRequestList: []
}

export default function(state: FriendState = initialState, action: FriendAction): FriendState {
    switch (action.type) {
        case FRIENDS_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            };

        case FRIENDS_ERROR:
            return {
                ...state, 
                error: action.error
            };

        case FRIENDS_SET_FRIEND_LIST:
            return {
                ...state,
                friendList: action.payload
            };
        
        case FRIENDS_SET_IN_REQUEST_LIST:
            return {
                ...state,
                inRequestList: action.payload
            };

        case FRIENDS_SET_OUT_REQUEST_LIST:
            return {
                ...state,
                outRequestList: action.payload
            };

        case FRIENDS_RESET_STATE:
            return initialState;

        default:
            return state;
    }
}

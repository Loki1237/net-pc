import { 
    SearchAction,
    SearchState,
    SEARCH_IS_LOADING,
    SEARCH_ERROR,
    SEARCH_SET_USER_LIST,
    SEARCH_RESET_STATE
 } from './types';

const initialState = {
    isLoading: false,
    error: "",
    userList: []
}

export default function(state: SearchState = initialState, action: SearchAction): SearchState {
    switch (action.type) {
        case SEARCH_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            };

        case SEARCH_ERROR:
            return {
                ...state, 
                error: action.error
            };

        case SEARCH_SET_USER_LIST:
            return {
                ...state,
                userList: action.payload
            };

        case SEARCH_RESET_STATE:
            return initialState;

        default:
            return state;
    }
}

import {
    UserPageState,
    UserPageAction,
    USER_PAGE_IS_LOADING,
    USER_PAGE_HAS_ERRORED,
    USER_PAGE_SET_USER_DATA,
    USER_PAGE_RESET_STATE
} from './types';

const initialState = {
    isLoading: false,
    hasErrored: false,
    currentUser: {
        id: 0,
        name: "",
        email: "",
        gender: "",
        birthday: "",
        country: "",
        city: "",
        family_status: "",
        avatar: "",
        status: "",
        activity: "",
        interests: "",
        hobby: "",
        about_self: ""
    },
    photoList: []
};

export default function(state: UserPageState = initialState, action: UserPageAction): UserPageState {
    switch (action.type) {
        case USER_PAGE_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading || false
            };

        case USER_PAGE_HAS_ERRORED:
            return {
                ...state, 
                hasErrored: action.hasErrored || false
            };

        case USER_PAGE_SET_USER_DATA:
            return {
                ...state,
                currentUser: action.payload ? action.payload.user : initialState.currentUser,
                photoList: action.payload ? action.payload.photoList : initialState.photoList
            };

        case USER_PAGE_RESET_STATE:
            return initialState;

        default:
            return state;
    }
}

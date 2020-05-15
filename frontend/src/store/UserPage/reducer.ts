import {
    UserPageState,
    UserPageAction,
    USER_PAGE_IS_LOADING,
    USER_PAGE_HAS_ERRORED,
    USER_PAGE_SET_USER_DATA,
    USER_PAGE_SET_PHOTO_LIST,
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
                isLoading: action.isLoading
            };

        case USER_PAGE_HAS_ERRORED:
            return {
                ...state, 
                hasErrored: action.hasErrored
            };

        case USER_PAGE_SET_USER_DATA:
            return {
                ...state,
                currentUser: action.payload
            };

        case USER_PAGE_SET_PHOTO_LIST:
            return {
                ...state,
                photoList: action.payload
            };

        case USER_PAGE_RESET_STATE:
            return initialState;

        default:
            return state;
    }
}

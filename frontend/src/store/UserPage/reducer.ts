import {
    UserPageState,
    UserPageAction,
    USER_PAGE_IS_LOADING,
    USER_PAGE_ERROR,
    USER_PAGE_SET_USER_DATA,
    USER_PAGE_SET_PAGE_OWNER,
    USER_PAGE_RESET_STATE
} from './types';

const initialState = {
    isLoading: false,
    error: "",
    currentUser: {
        id: 0,
        firstName: "",
        lastName: "",
        email: "",
        avatar: "",
        online: false,
        profile: {
            gender: "",
            birthday: "",
            country: "",
            city: "",
            familyStatus: "",
            activity: "",
            interests: "",
            hobby: "",
            aboutSelf: ""
        },
        photos: []
    },
    pageOwner: undefined
};

export default function(state: UserPageState = initialState, action: UserPageAction): UserPageState {
    switch (action.type) {
        case USER_PAGE_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            };

        case USER_PAGE_ERROR:
            return {
                ...state, 
                error: action.error
            };

        case USER_PAGE_SET_USER_DATA:
            return {
                ...state,
                currentUser: action.payload
            };

        case USER_PAGE_SET_PAGE_OWNER:
            return {
                ...state,
                pageOwner: action.owner
            };

        case USER_PAGE_RESET_STATE:
            return initialState;

        default:
            return state;
    }
}

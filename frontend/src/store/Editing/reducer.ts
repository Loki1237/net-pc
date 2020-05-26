import {
    EditionState,
    EditionAction,
    EDITING_IS_LOADING,
    EDITING_ERROR,
    EDITING_EDIT_BASIC_DATA,
    EDITING_EDIT_ABOUT_SELF_DATA,
    EDITING_SET_ALL_DATA,
    EDITING_RESET_STATE
} from './types';

const initialState = {
    isLoading: false,
    error: "",
    basicData: {
        firstName: "",
        lastName: "",
        birthday: "",
        familyStatus: "",
        country: "",
        city: ""
    },
    aboutSelfData: {
        activity: "",
        interests: "",
        hobby: "",
        aboutSelf: ""
    }
}

export default function(state: EditionState = initialState, action: EditionAction): EditionState {
    switch (action.type) {
        case EDITING_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            };

        case EDITING_ERROR:
            return {
                ...state,
                error: action.error
            };

        case EDITING_EDIT_BASIC_DATA:
            return {
                ...state,
                basicData: {
                    ...state.basicData,
                    [action.fieldName]: action.payload
                }
            };
            
        case EDITING_EDIT_ABOUT_SELF_DATA:
            return {
                ...state,
                aboutSelfData: {
                    ...state.aboutSelfData,
                    [action.fieldName]: action.payload
                }
            };

        case EDITING_SET_ALL_DATA:
            return {
                ...state,
                basicData: action.basicData,
                aboutSelfData: action.aboutSelfData

            };

        case EDITING_RESET_STATE:
            return initialState;

        default:
            return state;
    }
}

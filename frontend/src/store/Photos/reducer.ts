import {
    PhotoAction,
    PhotoState,
    PHOTOS_IS_LOADING,
    PHOTOS_ERROR,
    PHOTOS_SET_PHOTO_LIST,
    PHOTOS_SET_OWNER,
    PHOTOS_RESET_STATE
} from './types';

const initialState = {
    isLoading: false,
    error: "",
    photoList: [],
    owner: { name: "", id: 0 }
}

export default function(state: PhotoState = initialState, action: PhotoAction): PhotoState {
    switch (action.type) {
        case PHOTOS_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            };

        case PHOTOS_ERROR:
            return {
                ...state, 
                error: action.error
            };

        case PHOTOS_SET_PHOTO_LIST:
            return {
                ...state,
                photoList: action.payload
            };

        case PHOTOS_SET_OWNER:
            return {
                ...state,
                owner: action.owner
            };

        case PHOTOS_RESET_STATE:
            return initialState;

        default:
            return state;
    }
}

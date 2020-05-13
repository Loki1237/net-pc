import {
    PhotoAction,
    PhotoState,
    PHOTOS_IS_LOADING,
    PHOTOS_HAS_ERRORED,
    PHOTOS_SET_PHOTO_LIST,
    PHOTOS_SET_OWNER,
    PHOTOS_RESET_STATE
} from './types';

const initialState = {
    isLoading: false,
    hasErrored: false,
    photoList: [],
    owner: { name: "", id: 0 }
}

export default function(state: PhotoState = initialState, action: PhotoAction): PhotoState {
    switch (action.type) {
        case PHOTOS_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading || false
            };

        case PHOTOS_HAS_ERRORED:
            return {
                ...state, 
                hasErrored: action.hasErrored || false
            };

        case PHOTOS_SET_PHOTO_LIST:
            return {
                ...state,
                photoList: action.payload || []
            };

        case PHOTOS_SET_OWNER:
            return {
                ...state,
                owner: action.owner || { name: "", id: 0 }
            };

        case PHOTOS_RESET_STATE:
            return initialState;

        default:
            return state;
    }
}

import { 
    ImageViewerState, 
    Action, 
    SET_IMAGE_LIST, 
    CLEAR_IMAGE_LIST, 
    SET_CURRENT_IMAGE,
    OPEN_IMAGE_VIEWER,
    CLOSE_IMAGE_VIEWER
} from './types';

const initialState: ImageViewerState = {
    imageList: [],
    currentImage: {
        id: 0,
        userId: 0,
        url: "",
        timestamp: ""
    },
    isOpened: false,
    options: {
        navigation: true,
        deleteButton: true
    }
}

export default function(state = initialState, action: Action): ImageViewerState {
    switch (action.type) {
        case SET_IMAGE_LIST:
            return { 
                ...state, 
                imageList: Array.isArray(action.payload) ? action.payload : state.imageList
            };

        case SET_CURRENT_IMAGE:
            return { 
                ...state, 
                currentImage: !Array.isArray(action.payload) ? action.payload : state.currentImage
            };

        case CLEAR_IMAGE_LIST:
            return initialState;

        case OPEN_IMAGE_VIEWER:
            return { ...state, isOpened: true };

        case CLOSE_IMAGE_VIEWER:
            return { ...state, isOpened: false };
    }

    return state;
}

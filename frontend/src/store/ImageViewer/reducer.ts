import {
    ImageViewerState,
    ImageViewerAction,
    IMAGE_VIEWER_OPEN,
    IMAGE_VIEWER_CLOSE,
    IMAGE_VIEWER_NEXT_IMAGE,
    IMAGE_VIEWER_PREV_IMAGE
} from './types';

const initialState: ImageViewerState = {
    isOpened: false,
    currentImageIndex: 0,
    imageList: [{
        id: 0,
        userId: 0,
        url: "",
        timestamp: "0"
    }],
}

export default function(state = initialState, action: ImageViewerAction): ImageViewerState {
    switch (action.type) {
        case IMAGE_VIEWER_OPEN:
            return { 
                isOpened: true,
                currentImageIndex: action.index !== undefined ? action.index : state.currentImageIndex,
                imageList: action.payload || state.imageList
            };

        case IMAGE_VIEWER_CLOSE:
            return initialState;

        case IMAGE_VIEWER_NEXT_IMAGE:
            return { 
                ...state,
                currentImageIndex: state.currentImageIndex < state.imageList.length - 1
                                       ? state.currentImageIndex + 1
                                       : 0
            };

        case IMAGE_VIEWER_PREV_IMAGE:
            return { 
                ...state,
                currentImageIndex: state.currentImageIndex > 0
                                       ? state.currentImageIndex - 1
                                       : state.imageList.length - 1
            };

        default:
            return state;
    }
}

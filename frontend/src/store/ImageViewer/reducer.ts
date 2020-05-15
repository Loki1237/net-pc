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
    imageList: [],
    currentImage: {
        id: 0,
        userId: 0,
        url: "",
        timestamp: "0"
    },
    index: 0
}

export default function(state = initialState, action: ImageViewerAction): ImageViewerState {
    let newIndex: number;

    switch (action.type) {
        case IMAGE_VIEWER_OPEN:
            return { 
                isOpened: true,
                imageList: action.payload,
                currentImage: action.payload[action.index],
                index: action.index
            };

        case IMAGE_VIEWER_CLOSE:
            return {
                ...initialState,
                currentImage: state.currentImage
            };

        case IMAGE_VIEWER_NEXT_IMAGE:
            newIndex = state.index < state.imageList.length - 1 ? state.index + 1 : 0;

            return { 
                ...state,
                currentImage: state.imageList[newIndex],
                index: newIndex
            };

        case IMAGE_VIEWER_PREV_IMAGE:
            newIndex = state.index > 0 ? state.index - 1 : state.imageList.length - 1;

            return { 
                ...state,
                currentImage: state.imageList[newIndex],
                index: newIndex
            };

        default:
            return state;
    }
}

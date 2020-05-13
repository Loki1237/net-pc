import { Action } from 'redux'
import { RootState } from '../index'
import { ThunkAction } from 'redux-thunk'

export interface ImageViewerAction {
    type: string,
    payload?: Image[],
    index?: number
};

export interface Image {
    id: number,
    userId: number,
    url: string,
    timestamp: string
};

export interface ImageViewerState {
    currentImageIndex: number,
    imageList: Image[],
    isOpened: boolean
};

export type DispatchImageViewer = (arg: ImageViewerAction) => void;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

export const IMAGE_VIEWER_OPEN = "IMAGE_VIEWER_OPEN";
export const IMAGE_VIEWER_CLOSE = "IMAGE_VIEWER_CLOSE";
export const IMAGE_VIEWER_NEXT_IMAGE = "IMAGE_VIEWER_NEXT_IMAGE";
export const IMAGE_VIEWER_PREV_IMAGE = "IMAGE_VIEWER_PREV_IMAGE";

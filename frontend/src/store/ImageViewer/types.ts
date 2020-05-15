export const IMAGE_VIEWER_OPEN = "IMAGE_VIEWER_OPEN";
export const IMAGE_VIEWER_CLOSE = "IMAGE_VIEWER_CLOSE";
export const IMAGE_VIEWER_NEXT_IMAGE = "IMAGE_VIEWER_NEXT_IMAGE";
export const IMAGE_VIEWER_PREV_IMAGE = "IMAGE_VIEWER_PREV_IMAGE";

interface OpenViewerAction {
    type: typeof IMAGE_VIEWER_OPEN,
    payload: Image[],
    index: number
};

interface CloseViewerAction {
    type: typeof IMAGE_VIEWER_CLOSE
};

interface NextImageAction {
    type: typeof IMAGE_VIEWER_NEXT_IMAGE
};

interface PrevImageAction {
    type: typeof IMAGE_VIEWER_PREV_IMAGE
};

export type ImageViewerAction = OpenViewerAction
                                | CloseViewerAction
                                | NextImageAction
                                | PrevImageAction;

export interface Image {
    id: number,
    userId: number,
    url: string,
    timestamp: string
};

export interface ImageViewerState {
    isOpened: boolean,
    imageList: Image[],
    currentImage: Image,
    index: number
};


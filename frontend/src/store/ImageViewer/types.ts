export interface Action {
    type: string,
    payload: Image | Image[]
};

export interface Image {
    id: number,
    userId: number,
    url: string,
    timestamp: string
}

export interface ImageViewerState {
    imageList: Image[],
    currentImage: Image,
    isOpened: boolean,
    options: {
        navigation: boolean,
        deleteButton: boolean
    }
}

export const SET_IMAGE_LIST = "SET_IMAGE_LIST";
export const CLEAR_IMAGE_LIST = "CLEAR_IMAGE_LIST";
export const SET_CURRENT_IMAGE = "SET_CURRENT_IMAGE";
export const OPEN_IMAGE_VIEWER = "OPEN_IMAGE_VIEWER";
export const CLOSE_IMAGE_VIEWER = "CLOSE_IMAGE_VIEWER";

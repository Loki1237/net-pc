import { Action } from './types';
import {
    Image, 
    SET_IMAGE_LIST, 
    CLEAR_IMAGE_LIST, 
    SET_CURRENT_IMAGE, 
    OPEN_IMAGE_VIEWER  
} from '../ImageViewer/types';

export const setImageList = (payload: Image[]) => ({
    type: SET_IMAGE_LIST,
    payload
});

export const setCurrentImage = (payload: Image) => ({
    type: SET_CURRENT_IMAGE,
    payload
});

export const clearImageList = {
    type: CLEAR_IMAGE_LIST
};

export const openImageViewer = {
    type: OPEN_IMAGE_VIEWER
};

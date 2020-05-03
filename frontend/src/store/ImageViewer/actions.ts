import { SET_AVATAR } from '../UserPage/types';
import {
    Image, 
    Action,
    SET_IMAGE_LIST,
    SET_CURRENT_IMAGE, 
    CLOSE_IMAGE_VIEWER  
} from './types';

export const setImageList = (payload: Image[]): Action => ({
    type: SET_IMAGE_LIST,
    payload
});

export const setCurrentImage = (payload: Image): Action => ({
    type: SET_CURRENT_IMAGE,
    payload
});

export const closeImageViewer = {
    type: CLOSE_IMAGE_VIEWER
};

export const setAvatar = (payload: string) => ({
    type: SET_AVATAR,
    payload
});

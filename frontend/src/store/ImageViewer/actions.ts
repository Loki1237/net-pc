import { history } from '../../middleware';
import { AppThunkAction } from '../thunk';
import {
    Image,
    ImageViewerAction,
    IMAGE_VIEWER_OPEN,
    IMAGE_VIEWER_CLOSE,
    IMAGE_VIEWER_NEXT_IMAGE,
    IMAGE_VIEWER_PREV_IMAGE
} from './types';

export const openImageViewer = (payload: Image[], index: number): ImageViewerAction => ({
    type: IMAGE_VIEWER_OPEN,
    payload,
    index
});

export const closeImageViewer = (): ImageViewerAction => ({
    type: IMAGE_VIEWER_CLOSE
});

export const nextImage = (): ImageViewerAction => ({
    type: IMAGE_VIEWER_NEXT_IMAGE
});

export const prevImage = (): ImageViewerAction => ({
    type: IMAGE_VIEWER_PREV_IMAGE
});

export const deleteImage = (id: number): AppThunkAction => {
    return async () => {
        await fetch(`api/photo/${id}`, { method: "DELETE" });
        history.push(`${history.location.pathname}/update`);
    };
}

export const setAvatar = (avatar: string): AppThunkAction => {
    return async () => {
        await fetch('/api/users/set_avatar', {
            method: "POST",
            headers: { "Content-Type": "application/json;charset=utf-8" },
            body: JSON.stringify({ avatar })
        });
        history.push(`${history.location.pathname}/update`);
    };
}

import { SELECT_TRACK, SET_TRACK_LIST, Audio, Action } from './types';

export const setTrackList = (payload: Audio[]): Action => ({
    type: SET_TRACK_LIST,
    payload
});

export const selectTrack = (payload: Audio): Action => ({
    type: SELECT_TRACK,
    payload
});

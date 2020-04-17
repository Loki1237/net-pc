import { SELECT_TRACK, SET_TRACK_LIST, AudioTrackType, ActionType } from './types';

export const setTrackList = (payload: AudioTrackType[]): ActionType => ({
    type: SET_TRACK_LIST,
    payload
});

export const selectTrack = (payload: AudioTrackType): ActionType => ({
    type: SELECT_TRACK,
    payload
});

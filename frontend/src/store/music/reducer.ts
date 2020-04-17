import { ActionType, AudioTrackType } from './types';
import { SELECT_TRACK, SET_TRACK_LIST } from './types';

interface MusicType {
    trackList: AudioTrackType[],
    currentTrack: AudioTrackType
}

const initialState = {
    trackList: [],
    currentTrack: {
        id: 0,
        userId: 0,
        artist: "",
        name: "",
        url: "",
        duration: "",
        timestamp: ""
    }
}

export default function(state: MusicType = initialState, action: ActionType): MusicType {
    switch (action.type) {
        case SELECT_TRACK:
            return { ...state, currentTrack: action.payload };

        case SET_TRACK_LIST:
            return { ...state, trackList: action.payload };
    }

    return state;
}

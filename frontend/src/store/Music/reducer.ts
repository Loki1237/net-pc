import { Action, Audio, MusicState } from './types';
import { SELECT_TRACK, SET_TRACK_LIST } from './types';

const initialState: MusicState = {
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

export default function(state = initialState, action: Action): MusicState {
    switch (action.type) {
        case SET_TRACK_LIST:
            return { 
                ...state, 
                trackList: Array.isArray(action.payload) ? action.payload : state.trackList
            };

        case SELECT_TRACK:
            return { 
                ...state, 
                currentTrack: !Array.isArray(action.payload) ? action.payload : state.currentTrack
            };
    }

    return state;
}

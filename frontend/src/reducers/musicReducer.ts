import ActionType from '../types/ActionType';
import AudioTrackType from '../types/AudioTrackType';

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
        case "SELECT_TRACK":
            return { ...state, currentTrack: action.data };

        case "SET_TRACK_LIST":
            return { ...state, trackList: action.data };
    }

    return state;
}

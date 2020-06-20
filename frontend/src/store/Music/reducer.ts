import {
    MusicAction,
    MusicState,
    MUSIC_IS_LOADING,
    MUSIC_ERROR,
    MUSIC_SET_TRACK_LIST,
    MUSIC_SET_CURRENT_TRACK_FILE,
    MUSIC_SET_CURRENT_TRACK_STATUS,
    MUSIC_SET_CURRENT_TRACK_DATA,
    MUSIC_RESET_STATE
} from './types';

const initialState = {
    isLoading: false,
    error: "",
    trackList: [],
    sortBy: "timestamp",
    currentTrack: {
        audioFile: new Audio(""),
        status: "paused",
        data: {
            id: 0,
            userId: 0,
            name: "",
            url: "",
            duration: "",
            timestamp: ""
        }
    }
}

export default function(state: MusicState = initialState, action: MusicAction): MusicState {
    switch (action.type) {
        case MUSIC_IS_LOADING:
            return { 
                ...state, 
                isLoading: action.isLoading
            };

        case MUSIC_ERROR:
            return { 
                ...state, 
                error: action.error
            };

        case MUSIC_SET_TRACK_LIST:
            return { 
                ...state, 
                trackList: action.payload
            };

        case MUSIC_SET_CURRENT_TRACK_FILE:
            return { 
                ...state, 
                currentTrack: {
                    ...state.currentTrack,
                    audioFile: action.payload
                }
            };

        case MUSIC_SET_CURRENT_TRACK_STATUS:
            return { 
                ...state, 
                currentTrack: { 
                    ...state.currentTrack, 
                    status: action.payload
                }
            };

        case MUSIC_SET_CURRENT_TRACK_DATA:
            return { 
                ...state, 
                currentTrack: { 
                    ...state.currentTrack, 
                    data: action.payload
                }
            };

        case MUSIC_RESET_STATE:
            return initialState;

        default:
            return state;
    }
}

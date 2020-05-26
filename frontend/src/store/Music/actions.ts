import { AppThunkAction } from '../thunk';
import { Dispatch } from 'redux';
import { 
    MusicAction,
    Audio,
    MUSIC_IS_LOADING,
    MUSIC_ERROR,
    MUSIC_SET_TRACK_LIST,
    MUSIC_SET_CURRENT_TRACK_FILE,
    MUSIC_SET_CURRENT_TRACK_STATUS,
    MUSIC_SET_CURRENT_TRACK_DATA,
    MUSIC_RESET_STATE
} from './types';

export const musicIsLoading = (value: boolean): MusicAction => ({
    type: MUSIC_IS_LOADING,
    isLoading: value
});

export const musicError = (value: string): MusicAction => ({
    type: MUSIC_ERROR,
    error: value
});

export const musicSetTrackList = (payload: Audio[]): MusicAction => ({
    type: MUSIC_SET_TRACK_LIST,
    payload
});

export const musicSetCurrentTrackFile = (payload: HTMLAudioElement): MusicAction => ({
    type: MUSIC_SET_CURRENT_TRACK_FILE,
    payload
});

export const musicSetCurrentTrackStatus = (payload: string): MusicAction => ({
    type: MUSIC_SET_CURRENT_TRACK_STATUS,
    payload
});

export const musicSetCurrentTrackData = (payload: Audio): MusicAction => ({
    type: MUSIC_SET_CURRENT_TRACK_DATA,
    payload
});

export const musicResetState = (): MusicAction => ({
    type: MUSIC_RESET_STATE
});

const getMusic = async () => {
    const response = await fetch('/api/music');

    if (!response.ok) {
        throw Error(`${response.status} - ${response.statusText}`);
    }

    return await response.json();
}

export const updateTrackList = (): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(musicIsLoading(true));

        try {
            const music = await getMusic();
            dispatch(musicIsLoading(false));
            dispatch(musicSetTrackList(music));

            if (music.length) {
                const audio = new Audio(music[0].url);
                dispatch(musicSetCurrentTrackFile(audio));
                dispatch(musicSetCurrentTrackData(music[0]));
            }
        } catch(err) {
            dispatch(musicError(err.message));
        }
    };
}

export const createTrack = (file: FormData): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        await fetch('/api/music', {
            method: "POST",
            body: file
        });

        const music = await getMusic();
        dispatch(musicSetTrackList(music));
    };
}

export const changeTrack = (artist: string, name: string, id: number): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        await fetch(`api/music/${id}`, { 
            method: "PUT",
            headers: { "Content-Type": "Application/json;charset=utf-8" },
            body: JSON.stringify({ artist, name })
        });

        const music = await getMusic();
        dispatch(musicSetTrackList(music));
    };
}

export const deleteTrack = (id: number): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        await fetch(`api/music/${id}`, { method: "DELETE" });
        
        const music = await getMusic();
        dispatch(musicSetTrackList(music));
    };
}

export const setTrackAndPlay = (track: Audio): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        const audio = new Audio(track.url);
        audio.addEventListener("loadedmetadata", () => audio.play(), { once: true })
        dispatch(musicSetCurrentTrackFile(audio));
        dispatch(musicSetCurrentTrackStatus("playing"));
        dispatch(musicSetCurrentTrackData(track));
    };
}

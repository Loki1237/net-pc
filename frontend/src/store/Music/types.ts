export const MUSIC_IS_LOADING = "MUSIC_IS_LOADING";
export const MUSIC_ERROR = "MUSIC_ERROR";
export const MUSIC_SET_TRACK_LIST = "MUSIC_SET_TRACK_LIST";
export const MUSIC_SET_CURRENT_TRACK_FILE = "MUSIC_SET_CURRENT_TRACK_FILE";
export const MUSIC_SET_CURRENT_TRACK_STATUS = "MUSIC_SET_CURRENT_TRACK_STATUS";
export const MUSIC_SET_CURRENT_TRACK_DATA = "MUSIC_SET_CURRENT_TRACK_DATA";
export const MUSIC_RESET_STATE = "MUSIC_RESET_STATE";

interface LoadingAction {
    type: typeof MUSIC_IS_LOADING,
    isLoading: boolean,
}

interface ErroredAction {
    type: typeof MUSIC_ERROR,
    error: string,
}

interface SetTrackListAction {
    type: typeof MUSIC_SET_TRACK_LIST,
    payload: Audio[]
}

interface SetCurrentTrackFileAction {
    type: typeof MUSIC_SET_CURRENT_TRACK_FILE,
    payload: HTMLAudioElement
}

interface SetCurrentTrackStatusAction {
    type: typeof MUSIC_SET_CURRENT_TRACK_STATUS,
    payload: string
}

interface SetCurrentTrackDataAction {
    type: typeof MUSIC_SET_CURRENT_TRACK_DATA,
    payload: Audio
}

interface ResetStateAction {
    type: typeof MUSIC_RESET_STATE
}

export type MusicAction = LoadingAction
                          | ErroredAction
                          | SetTrackListAction
                          | SetCurrentTrackFileAction
                          | SetCurrentTrackStatusAction
                          | SetCurrentTrackDataAction
                          | ResetStateAction

export interface Audio {
    id: number,
    userId: number,
    name: string,
    url: string,
    duration: string,
    timestamp: string
}

export interface CurrentTrack {
    audioFile: HTMLAudioElement,
    status: string
    data: Audio
}

export interface MusicState {
    isLoading: boolean,
    error: string,
    trackList: Audio[],
    sortBy: string,
    currentTrack: CurrentTrack
}

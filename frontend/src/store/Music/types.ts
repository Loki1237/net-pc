export const SELECT_TRACK = "SELECT_TRACK";
export const SET_TRACK_LIST = "SET_TRACK_LIST";

export interface Action {
    type: string,
    payload: Audio | Audio[]
};

export interface Audio {
    id: number,
    userId: number,
    artist: string,
    name: string,
    url: string,
    duration: string,
    timestamp: string
};

export interface MusicState {
    trackList: Audio[],
    currentTrack: Audio
}

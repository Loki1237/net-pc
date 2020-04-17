export const SELECT_TRACK = "SELECT_TRACK";
export const SET_TRACK_LIST = "SET_TRACK_LIST";

export interface ActionType {
    type: string,
    payload: any
};

export interface AudioTrackType {
    id: number,
    userId: number,
    artist: string,
    name: string,
    url: string,
    duration: string,
    timestamp: string
};

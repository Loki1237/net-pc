import { connect } from 'react-redux';
import { RootState } from '../reducers/index';
import AudioContainer from '../app/Music/AudioContainer';

const mapState = (state: RootState) => ({
    currentTrack: state.music.currentTrack,
    trackList: state.music.trackList
});

const mapDispatch = (dispatch: any) => ({
    selectTrack: (data: any) => {
        dispatch({
            type: "SELECT_TRACK",
            data
        });
    },
    setTrackList: (data: any) => {
        dispatch({
            type: "SET_TRACK_LIST",
            data
        });
    }
});

export default connect(mapState, mapDispatch)(AudioContainer);

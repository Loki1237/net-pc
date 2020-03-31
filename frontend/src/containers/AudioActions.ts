import { connect } from 'react-redux';
import { RootState } from '../reducers/index';
import AudioActions from '../app/Music/AudioActions';

const mapState = (state: RootState) => ({
    currentTrack: state.music.currentTrack,
    trackList: state.music.trackList
});

const mapDispatch = (dispatch: any) => ({
    setTrackList: (data: any) => {
        dispatch({
            type: "SET_TRACK_LIST",
            data
        });
    }
});

export default connect(mapState, mapDispatch)(AudioActions);

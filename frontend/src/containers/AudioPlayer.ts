import { connect } from 'react-redux';
import { RootState } from '../reducers/index';
import AudioPlayer from '../app/Music/AudioPlayer';

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
    }
});

export default connect(mapState, mapDispatch)(AudioPlayer);

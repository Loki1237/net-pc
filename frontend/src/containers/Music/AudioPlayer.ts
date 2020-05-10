import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import AudioPlayer from '../../components/Music/AudioPlayer';
import { Audio } from '../../store/Music/types';
import { selectTrack } from '../../store/Music/actions';

const mapState = (state: RootState) => ({
    currentTrack: state.music.currentTrack,
    trackList: state.music.trackList
});

const mapDispatch = (dispatch: any) => ({
    selectTrack: (payload: Audio) => dispatch(selectTrack(payload))
});

export default connect(mapState, mapDispatch)(AudioPlayer);

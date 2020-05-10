import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import AudioActions from '../../components/Music/AudioActions';
import { Audio } from '../../store/Music/types';
import { setTrackList } from '../../store/Music/actions';

const mapState = (state: RootState) => ({
    currentTrack: state.music.currentTrack,
    trackList: state.music.trackList
});

const mapDispatch = (dispatch: any) => ({
    setTrackList: (payload: Audio[]) => dispatch(setTrackList(payload))
});

export default connect(mapState, mapDispatch)(AudioActions);

import { connect } from 'react-redux';
import { RootState } from '../../index';
import AudioActions from '../../../components/Music/AudioActions';
import { Audio } from '../types';
import { setTrackList } from '../actions';

const mapState = (state: RootState) => ({
    currentTrack: state.music.currentTrack,
    trackList: state.music.trackList
});

const mapDispatch = (dispatch: any) => ({
    setTrackList: (payload: Audio[]) => dispatch(setTrackList(payload))
});

export default connect(mapState, mapDispatch)(AudioActions);

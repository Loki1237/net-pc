import { connect } from 'react-redux';
import { RootState } from '../../index';
import AudioActions from '../../../components/Music/AudioActions';
import { AudioTrackType } from '../types';
import { setTrackList } from '../actions';

const mapState = (state: RootState) => ({
    currentTrack: state.music.currentTrack,
    trackList: state.music.trackList
});

const mapDispatch = (dispatch: any) => ({
    setTrackList: (payload: AudioTrackType[]) => dispatch(setTrackList(payload))
});

export default connect(mapState, mapDispatch)(AudioActions);

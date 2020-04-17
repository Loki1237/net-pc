import { connect } from 'react-redux';
import { RootState } from '../../index';
import AudioPlayer from '../../../components/Music/AudioPlayer';
import { AudioTrackType } from '../types';
import { selectTrack } from '../actions';

const mapState = (state: RootState) => ({
    currentTrack: state.music.currentTrack,
    trackList: state.music.trackList
});

const mapDispatch = (dispatch: any) => ({
    selectTrack: (payload: AudioTrackType) => dispatch(selectTrack(payload))
});

export default connect(mapState, mapDispatch)(AudioPlayer);

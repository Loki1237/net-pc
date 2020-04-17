import { connect } from 'react-redux';
import { RootState } from '../../index';
import AudioContainer from '../../../components/Music/AudioContainer';
import { AudioTrackType } from '../types';
import { setTrackList, selectTrack } from '../actions';

const mapState = (state: RootState) => ({
    currentTrack: state.music.currentTrack,
    trackList: state.music.trackList
});

const mapDispatch = (dispatch: any) => ({
    selectTrack: (payload: AudioTrackType) => dispatch(selectTrack(payload)),
    setTrackList: (payload: AudioTrackType[]) => dispatch(setTrackList(payload))
});

export default connect(mapState, mapDispatch)(AudioContainer);

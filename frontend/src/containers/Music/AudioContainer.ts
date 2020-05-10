import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import AudioContainer from '../../components/Music/AudioContainer';
import { Audio } from '../../store/Music/types';
import { setTrackList, selectTrack } from '../../store/Music/actions';

const mapState = (state: RootState) => ({
    currentTrack: state.music.currentTrack,
    trackList: state.music.trackList
});

const mapDispatch = (dispatch: any) => ({
    selectTrack: (payload: Audio) => dispatch(selectTrack(payload)),
    setTrackList: (payload: Audio[]) => dispatch(setTrackList(payload))
});

export default connect(mapState, mapDispatch)(AudioContainer);

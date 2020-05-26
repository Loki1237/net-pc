import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import Player from '../../components/Music/Player';
import { Audio } from '../../store/Music/types';
import { AppThunkDispatch } from '../../store/thunk';
import { setTrackAndPlay, musicSetCurrentTrackStatus } from '../../store/Music/actions';

const mapState = (state: RootState) => ({
    currentTrack: state.music.currentTrack,
    trackList: state.music.trackList
});

const mapDispatch = (dispatch: AppThunkDispatch) => ({
    setTrackAndPlay: (track: Audio) => dispatch(setTrackAndPlay(track)),
    setCurrentTrackStatus: (status: string) => dispatch(musicSetCurrentTrackStatus(status))
});

export default connect(mapState, mapDispatch)(Player);

import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import Music from '../../components/Music/Music';
import { AppThunkDispatch } from '../../store/thunk';
import { Audio } from '../../store/Music/types';
import {
    updateTrackList,
    createTrack,
    changeTrack,
    deleteTrack,
    musicResetState,
    setTrackAndPlay
} from '../../store/Music/actions';

const mapState = (state: RootState) => ({
    isLoading: state.music.isLoading,
    error: state.music.error,
    trackList: state.music.trackList,
    currentTrack: state.music.currentTrack
});

const mapDispatch = (dispatch: AppThunkDispatch) => ({
    updateTrackList: () => dispatch(updateTrackList()),
    createTrack: (file: FormData) => dispatch(createTrack(file)),
    changeTrack: (artist: string, name: string, id: number) => dispatch(changeTrack(artist, name, id)),
    deleteTrack: (id: number) => dispatch(deleteTrack(id)),
    resetState: () => dispatch(musicResetState()),
    setTrackAndPlay: (track: Audio) => dispatch(setTrackAndPlay(track))
});

export default connect(mapState, mapDispatch)(Music);

import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import UserPage from '../../components/UserPage/UserPage';
import { openImageViewer } from '../../store/ImageViewer/actions';
import { Image } from '../../store/ImageViewer/types';
import {
    updateUserData,
    changeAvatar,
    resetAvatar,
    userPageResetState
} from '../../store/UserPage/actions';

const mapState = (state: RootState) => ({
    isLoading: state.users.isLoading,
    hasErrored: state.users.hasErrored,
    currentUser: state.users.currentUser,
    photoList: state.users.photoList
});

const mapDispatch = (dispatch: Function) => ({
    updateUserData: (id: number) => dispatch(updateUserData(id)),
    changeAvatar: (file: FormData) => dispatch(changeAvatar(file)),
    resetAvatar: () => dispatch(resetAvatar()),
    resetState: () => dispatch(userPageResetState()),
    openImageViewer: (payload: Image[], index: number) => dispatch(openImageViewer(payload, index))
});

export default connect(mapState, mapDispatch)(UserPage);

import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import UserPage from '../../components/UserPage/UserPage';
import { openImageViewer } from '../../store/ImageViewer/actions';
import { sendFriendRequest } from '../../store/Friends/actions';
import { Image } from '../../store/ImageViewer/types';
import { AppThunkDispatch } from '../../store/thunk';
import {
    updateUserData,
    changeAvatar,
    resetAvatar,
    createDialog,
    userPageResetState
} from '../../store/UserPage/actions';

const mapState = (state: RootState) => ({
    isLoading: state.users.isLoading,
    error: state.users.error,
    currentUser: state.users.currentUser,
    pageOwner: state.users.pageOwner,
    userId: state.app.userId
});

const mapDispatch = (dispatch: AppThunkDispatch) => ({
    updateUserData: (id: number) => dispatch(updateUserData(id)),
    changeAvatar: (file: FormData) => dispatch(changeAvatar(file)),
    resetAvatar: () => dispatch(resetAvatar()),
    resetState: () => dispatch(userPageResetState()),
    openImageViewer: (payload: Image[], index: number) => dispatch(openImageViewer(payload, index)),
    sendFriendRequest: (userId: number) => dispatch(sendFriendRequest(userId)),
    createDialog: (userId: number) => dispatch(createDialog(userId))
});

export default connect(mapState, mapDispatch)(UserPage);

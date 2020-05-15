import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import Messages from '../../components/Messages/Messages';
import { User } from '../../store/Messages/types';
import { AppThunkDispatch } from '../../store/thunk';
import {
    updateUserList,
    selectDialog,
    sendMessage,
    messagesResetCurrentUser,
    messagesResetState
} from '../../store/Messages/actions';

const mapState = (state: RootState) => ({
    isLoading: state.messages.isLoading,
    hasErrored: state.messages.hasErrored,
    userList: state.messages.userList,
    messageList: state.messages.messageList,
    currentUser: state.messages.currentUser
});

const mapDispatch = (dispatch: AppThunkDispatch) => ({
    updateUserList: () => dispatch(updateUserList()),
    selectDialog: (user: User) => dispatch(selectDialog(user)),
    sendMessage: (targetId: number, content: string) => dispatch(sendMessage(targetId, content)),
    resetCurrentUser: () => dispatch(messagesResetCurrentUser()),
    resetState: () => dispatch(messagesResetState())
});

export default connect(mapState, mapDispatch)(Messages);

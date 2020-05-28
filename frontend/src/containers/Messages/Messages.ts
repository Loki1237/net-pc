import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import Messages from '../../components/Messages/Messages';
import { User, Message } from '../../store/Messages/types';
import { AppThunkDispatch } from '../../store/thunk';
import {
    addMessageInList,
    updateUserList,
    selectDialog,
    sendMessage,
    messagesResetCurrentUser,
    messagesResetState
} from '../../store/Messages/actions';

const mapState = (state: RootState) => ({
    isLoading: state.messages.isLoading,
    error: state.messages.error,
    userList: state.messages.userList,
    messageList: state.messages.messageList,
    currentUser: state.messages.currentUser,
    userId: state.app.userId
});

const mapDispatch = (dispatch: AppThunkDispatch) => ({
    addMessageInList: (message: Message) => dispatch(addMessageInList(message)),
    updateUserList: () => dispatch(updateUserList()),
    selectDialog: (user: User) => dispatch(selectDialog(user)),
    sendMessage: (targetId: number, content: string) => dispatch(sendMessage(targetId, content)),
    resetCurrentUser: () => dispatch(messagesResetCurrentUser()),
    resetState: () => dispatch(messagesResetState())
});

export default connect(mapState, mapDispatch)(Messages);

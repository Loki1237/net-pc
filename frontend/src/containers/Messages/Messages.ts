import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import Messages from '../../components/Messages/Messages';
import { User, Message, Conversation } from '../../store/Messages/types';
import { AppThunkDispatch } from '../../store/thunk';
import {
    messagesAddMessageInList,
    updateConversationList,
    createChat,
    selectConversation,
    setFriendList,
    messagesClearFriendList,
    addParticipants,
    deleteParticipant,
    deleteConversation,
    messagesResetCurrentConversation,
    messagesResetState
} from '../../store/Messages/actions';

const mapState = (state: RootState) => ({
    isLoading: state.messages.isLoading,
    error: state.messages.error,
    conversations: state.messages.conversations,
    messageList: state.messages.messageList,
    friendList: state.messages.friendList,
    currentConversation: state.messages.currentConversation,
    userId: state.app.userId
});

const mapDispatch = (dispatch: AppThunkDispatch) => ({
    addMessageInList: (message: Message) => dispatch(messagesAddMessageInList(message)),
    updateConversationList: () => dispatch(updateConversationList()),
    createChat: (name: string) => dispatch(createChat(name)),
    selectConversation: (conversation: Conversation) => dispatch(selectConversation(conversation)),
    setFriendList: () => dispatch(setFriendList()),
    clearFriendList: () => dispatch(messagesClearFriendList()),
    addParticipants: (conversationId: number, userIds: { id: number }[]) => dispatch(addParticipants(conversationId, userIds)),
    deleteParticipant: (conversationId: number, userId: number) => dispatch(deleteParticipant(conversationId, userId)),
    deleteConversation: (id: number, type: "dialog" | "chat") => dispatch(deleteConversation(id, type)) ,
    resetCurrentConversation: () => dispatch(messagesResetCurrentConversation()),
    resetState: () => dispatch(messagesResetState())
});

export default connect(mapState, mapDispatch)(Messages);

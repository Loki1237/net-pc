import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import MyFriends from '../../components/Friends/MyFriends';
import { updateFriendList, friendsResetState } from '../../store/Friends/actions';
import { AppThunkDispatch } from '../../store/thunk';

const mapState = (state: RootState) => ({
    isLoading: state.friends.isLoading,
    error: state.friends.error,
    friendList: state.friends.friendList
});

const mapDispatch = (dispatch: AppThunkDispatch) => ({
    updateFriendList: () => dispatch(updateFriendList()),
    resetState: () => dispatch(friendsResetState())
});

export default connect(mapState, mapDispatch)(MyFriends);

import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import OutRequests from '../../components/Friends/OutRequests';
import { updateOutRequestList, deleteRequest, friendsResetState } from '../../store/Friends/actions';
import { AppThunkDispatch } from '../../store/thunk';

const mapState = (state: RootState) => ({
    isLoading: state.friends.isLoading,
    error: state.friends.error,
    outRequestList: state.friends.outRequestList
});

const mapDispatch = (dispatch: AppThunkDispatch) => ({
    updateOutRequestList: () => dispatch(updateOutRequestList()),
    deleteRequest: (id: number) => dispatch(deleteRequest(id)),
    resetState: () => dispatch(friendsResetState())
});

export default connect(mapState, mapDispatch)(OutRequests);

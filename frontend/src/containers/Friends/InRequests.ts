import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import InRequests from '../../components/Friends/InRequests';
import {
    updateInRequestList,
    confirmRequest,
    deleteRequest,
    friendsResetState
} from '../../store/Friends/actions';
import { AppThunkDispatch } from '../../store/thunk';

const mapState = (state: RootState) => ({
    isLoading: state.friends.isLoading,
    error: state.friends.error,
    inRequestList: state.friends.inRequestList
});

const mapDispatch = (dispatch: AppThunkDispatch) => ({
    updateInRequestList: () => dispatch(updateInRequestList()),
    confirmRequest: (id: number) => dispatch(confirmRequest(id)),
    deleteRequest: (id: number, type: "in" | "out") => dispatch(deleteRequest(id, type)),
    resetState: () => dispatch(friendsResetState())
});

export default connect(mapState, mapDispatch)(InRequests);

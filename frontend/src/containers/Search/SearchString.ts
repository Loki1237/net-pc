import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import SearchString from '../../components/Search/SearchString';
import { updateUserList, searchResetState } from '../../store/Search/actions';
import { AppThunkDispatch } from '../../store/thunk';

const mapState = (state: RootState) => ({
    userList: state.search.userList
});

const mapDispatch = (dispatch: AppThunkDispatch) => ({
    search: (payload: string) => dispatch(updateUserList(payload)),
    resetState: () => dispatch(searchResetState())
});

export default connect(mapState, mapDispatch)(SearchString);

import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import Input from '../../components/Search/Input';
import { updateUserList, searchResetState } from '../../store/Search/actions';
import { AppThunkDispatch } from '../../store/thunk';

const mapState = (state: RootState) => ({
    userList: state.search.userList
});

const mapDispatch = (dispatch: AppThunkDispatch) => ({
    search: (name: string) => dispatch(updateUserList(name)),
    resetState: () => dispatch(searchResetState())
});

export default connect(mapState, mapDispatch)(Input);

import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import Container from '../../components/Search/Container';
import { searchResetState } from '../../store/Search/actions';
import { Dispatch } from 'redux'

const mapState = (state: RootState) => ({
    isLoading: state.search.isLoading,
    error: state.search.error,
    userList: state.search.userList
});

const mapDispatch = (dispatch: Dispatch) => ({
    resetState: () => dispatch(searchResetState())
});

export default connect(mapState, mapDispatch)(Container);

import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import SearchContainer from '../../components/Search/SearchContainer';
import { searchResetState } from '../../store/Search/actions';
import { Dispatch } from 'redux'

const mapState = (state: RootState) => ({
    isLoading: state.search.isLoading,
    hasErrored: state.search.hasErrored,
    userList: state.search.userList
});

const mapDispatch = (dispatch: Dispatch) => ({
    resetState: () => dispatch(searchResetState())
});

export default connect(mapState, mapDispatch)(SearchContainer);

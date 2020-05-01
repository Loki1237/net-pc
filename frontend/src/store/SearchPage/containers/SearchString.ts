import { connect } from 'react-redux';
import { RootState } from '../../index';
import SearchString from '../../../components/SearchPage/SearchString';
import { setSearchedUserList } from '../actions';
import { SearchedUser } from '../types';

const mapState = (state: RootState) => ({
    search: state.search
});

const mapDispatch = (dispatch: any) => ({
    setSearchedUserList: (payload: SearchedUser[]) => dispatch(setSearchedUserList(payload))
});

export default connect(mapState, mapDispatch)(SearchString);

import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import SearchString from '../../components/SearchPage/SearchString';
import { setSearchedUserList } from '../../store/SearchPage/actions';
import { SearchedUser } from '../../store/SearchPage/types';

const mapState = (state: RootState) => ({
    search: state.search
});

const mapDispatch = (dispatch: any) => ({
    setSearchedUserList: (payload: SearchedUser[]) => dispatch(setSearchedUserList(payload))
});

export default connect(mapState, mapDispatch)(SearchString);

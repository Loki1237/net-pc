import { connect } from 'react-redux';
import { RootState } from '../reducers/index';
import SearchString from '../app/SearchPage/SearchString';

const mapState = (state: RootState) => ({
    search: state.search
});

const mapDispatch = (dispatch: any) => ({
    setSearchedUserList: (data: object[]) => {
        dispatch({
            type: "SET_SEARCHED_USER_LIST",
            data
        });
    }
});

export default connect(mapState, mapDispatch)(SearchString);

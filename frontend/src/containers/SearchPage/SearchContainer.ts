import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import SearchContainer from '../../components/SearchPage/SearchContainer';

const mapState = (state: RootState) => ({
    search: state.search
});

const mapDispatch = (dispatch: any) => ({
    
});

export default connect(mapState, mapDispatch)(SearchContainer);

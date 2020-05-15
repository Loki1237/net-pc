import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import SearchFilter from '../../components/Search/SearchFilter';

const mapState = (state: RootState) => ({
    search: state.search
});

const mapDispatch = (dispatch: any) => ({
    
});

export default connect(mapState, mapDispatch)(SearchFilter);

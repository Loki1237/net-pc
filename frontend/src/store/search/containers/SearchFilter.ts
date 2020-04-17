import { connect } from 'react-redux';
import { RootState } from '../../index';
import SearchFilter from '../../../components/SearchPage/SearchFilter';

const mapState = (state: RootState) => ({
    search: state.search
});

const mapDispatch = (dispatch: any) => ({
    
});

export default connect(mapState, mapDispatch)(SearchFilter);

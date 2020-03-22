import { connect } from 'react-redux';
import { RootState } from '../reducers/index';
import AutBar from '../app/AutBar/AutBar';

const mapState = (state: RootState) => ({
    appState: state.appState
});

const mapDispatch = (dispatch: any) => ({
    setNavBar: (data: boolean) => {
        dispatch({
            type: "SET_NAVBAR",
            data
        });
    }
});

export default connect(mapState, mapDispatch)(AutBar);
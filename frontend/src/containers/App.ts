import { connect } from 'react-redux';
import { RootState } from '../reducers/index';
import App from '../app/App';

const mapState = (state: RootState) => ({
    appState: state.appState
});

const mapDispatch = (dispatch: any) => ({
    setUserId: (data: number) => {
        dispatch({
            type: "SET_USER_ID",
            data
        });
    }
});

export default connect(mapState, mapDispatch)(App);

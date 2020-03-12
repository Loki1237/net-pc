import { connect } from 'react-redux';
import { RootState } from '../reducers/index';
import App from '../app/App';

const mapState = (state: RootState) => ({
    appState: state.appState,
    alert: state.alert
});

const mapDispatch = (dispatch: any) => ({
    setNavBar: (data: boolean) => {
        dispatch({
            type: "SET_NAVBAR",
            data
        });
    },
    closeAlert: () => {
        dispatch({
            type: "CLOSE_ALERT"
        });
    }
});

export default connect(mapState, mapDispatch)(App);

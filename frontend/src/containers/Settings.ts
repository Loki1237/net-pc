import { connect } from 'react-redux';
import { RootState } from '../reducers/index';
import Settings from '../app/Settings/Settings';

const mapState = (state: RootState) => ({
    appState: state.appState,
    alert: state.alert
});

const mapDispatch = (dispatch: any) => ({
    showAlert: (type: string, text: string) => {
        dispatch({
            type: "SHOW_ALERT",
            data: {
                type,
                text
            }
        });
    }
});

export default connect(mapState, mapDispatch)(Settings);

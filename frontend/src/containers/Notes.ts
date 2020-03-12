import { connect } from 'react-redux';
import { RootState } from '../reducers/index';
import Notes from '../app/Notes/Notes';

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

export default connect(mapState, mapDispatch)(Notes);

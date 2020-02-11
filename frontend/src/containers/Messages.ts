import { connect } from 'react-redux';
import { RootState } from '../reducers/index';
import Messages from '../app/Messages/Messages';

const mapState = (state: RootState) => ({
    appState: state.appState
});

export default connect(mapState)(Messages);

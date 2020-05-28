import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import AutBar from '../../components/AutBar/AutBar';

const mapState = (state: RootState) => ({
    logInLoading: state.auth.logInLoading,
    signUpLoading: state.auth.signUpLoading,
    error: state.auth.error
});

export default connect(mapState)(AutBar);

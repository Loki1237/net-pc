import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import { AppThunkDispatch } from '../../store/thunk';
import SignIn from '../../components/AutBar/SignIn';
import { logIn } from '../../store/AutBar/actions';

const mapState = (state: RootState) => ({
    logInLoading: state.auth.logInLoading,
    error: state.auth.error
});

const mapDispatch = (dispatch: AppThunkDispatch) => ({
    logIn: (email: string, password: string) => dispatch(logIn(email, password))
});

export default connect(mapState, mapDispatch)(SignIn);

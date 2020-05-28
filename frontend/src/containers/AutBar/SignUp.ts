import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import { AppThunkDispatch } from '../../store/thunk';
import SignUp from '../../components/AutBar/SignUp';
import { signUp } from '../../store/AutBar/actions';
import { SignUpUserData } from '../../store/AutBar/types';

const mapState = (state: RootState) => ({
    signUpLoading: state.auth.signUpLoading,
    error: state.auth.error
});

const mapDispatch = (dispatch: AppThunkDispatch) => ({
    signUp: (data: SignUpUserData) => dispatch(signUp(data))
});

export default connect(mapState, mapDispatch)(SignUp);

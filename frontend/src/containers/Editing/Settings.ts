import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import Settings from '../../components/Editing/Settings';
import { saveEmail, savePassword } from '../../store/Editing/actions';
import { AppThunkDispatch } from '../../store/thunk';

const mapState = (state: RootState) => ({
    isLoading: state.editing.isLoading,
    error: state.editing.error
})

const mapDispatch = (dispatch: AppThunkDispatch) => ({
    saveEmail: (email: string) => dispatch(saveEmail(email)),
    savePassword: (password: { oldPassword: string, newPassword: string }) => dispatch(savePassword(password))
})

export default connect(mapState, mapDispatch)(Settings);

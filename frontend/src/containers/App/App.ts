import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import { AppThunkDispatch } from '../../store/thunk';
import App from '../../App';
import { appUserLogIn, appUserLogOut, logInAs, logOut } from '../../store/App/actions';

const mapState = (state: RootState) => ({
    userIsLogged: state.app.userIsLogged,
    userId: state.app.userId
});

const mapDispatch = (dispatch: AppThunkDispatch) => ({
    userLogIn: (id: number) => dispatch(appUserLogIn(id)),
    userLogOut: () => dispatch(appUserLogOut()),
    logInAs: () => dispatch(logInAs()),
    logOut: () => dispatch(logOut())
});

export default connect(mapState, mapDispatch)(App);

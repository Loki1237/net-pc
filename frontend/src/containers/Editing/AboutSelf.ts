import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import AboutSelf from '../../components/Editing/AboutSelf';
import {
    getUserData,
    editingEditAboutSelfData,
    saveAboutSelfData,
    editingResetState
} from '../../store/Editing/actions';
import { AboutSelfType } from '../../store/Editing/types';
import { AppThunkDispatch } from '../../store/thunk';

const mapState = (state: RootState) => ({
    isLoading: state.editing.isLoading,
    error: state.editing.error,
    aboutSelf: state.editing.aboutSelfData
});

const mapDispatch = (dispatch: AppThunkDispatch) => ({
    getUserData: () => dispatch(getUserData()),
    edit: (fieldName: string, value: string) => dispatch(editingEditAboutSelfData(fieldName, value)),
    resetState: () => dispatch(editingResetState()),
    save: (data: AboutSelfType) => dispatch(saveAboutSelfData(data))
});

export default connect(mapState, mapDispatch)(AboutSelf);

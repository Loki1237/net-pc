import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import BasicData from '../../components/Editing/BasicData';
import {
    getUserData,
    editingEditBasicData,
    editingResetState,
    saveBasicData 
} from '../../store/Editing/actions';
import { BasicDataType } from '../../store/Editing/types';
import { AppThunkDispatch } from '../../store/thunk';

const mapState = (state: RootState) => ({
    isLoading: state.editing.isLoading,
    error: state.editing.error,
    basicData: state.editing.basicData
});

const mapDispatch = (dispatch: AppThunkDispatch) => ({
    getUserData: () => dispatch(getUserData()),
    edit: (fieldName: string, value: string) => dispatch(editingEditBasicData(fieldName, value)),
    save: (data: BasicDataType) => dispatch(saveBasicData(data)),
    resetState: () => dispatch(editingResetState())
});

export default connect(mapState, mapDispatch)(BasicData);

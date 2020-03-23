import { connect } from 'react-redux';
import { RootState } from '../reducers/index';
import SearchContainer from '../app/SearchPage/SearchContainer';

const mapState = (state: RootState) => ({
    messages: state.messages,
    search: state.search
});

const mapDispatch = (dispatch: any) => ({
    setDialogUser: async (data: any) => {
        dispatch({
            type: "SET_DEALOG_USER",
            data
        });
    },
    setDialogMessages: (data: any[]) => {
        dispatch({
            type: "SET_DIALOG_MESSAGES",
            data
        });
    }
});

export default connect(mapState, mapDispatch)(SearchContainer);

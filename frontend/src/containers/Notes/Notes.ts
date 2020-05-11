import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import Notes from '../../components/Notes/Notes';
import {
    updateNoteList,
    createNote,
    changeNote,
    deleteNote,
    notesResetState
} from '../../store/Notes/actions';

const mapState = (state: RootState) => ({
    isLoading: state.notes.isLoading,
    hasErrored: state.notes.hasErrored,
    noteList: state.notes.noteList
});

const mapDispatch = (dispatch: Function) => ({
    updateNoteList: () => dispatch(updateNoteList()),
    createNote: (header: string, content: string) => dispatch(createNote(header, content)),
    changeNote: (header: string, content: string, id: number) => dispatch(changeNote(header, content, id)),
    deleteNote: (id: number) => dispatch(deleteNote(id)),
    resetState: () => dispatch(notesResetState())
});

export default connect(mapState, mapDispatch)(Notes);

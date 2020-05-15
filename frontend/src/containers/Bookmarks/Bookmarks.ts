import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import Bookmarks from '../../components/Bookmarks/Bookmarks';
import { AppThunkDispatch } from '../../store/thunk';
import {
    updateBookmarkList,
    createBookmark,
    changeBookmark,
    deleteBookmark,
    bookmarksResetState
} from '../../store/Bookmarks/actions';

const mapState = (state: RootState) => ({
    isLoading: state.bookmarks.isLoading,
    hasErrored: state.bookmarks.hasErrored,
    bookmarkList: state.bookmarks.bookmarkList
});

const mapDispatch = (dispatch: AppThunkDispatch) => ({
    updateBookmarkList: () => dispatch(updateBookmarkList()),
    createBookmark: (header: string, content: string) => dispatch(createBookmark(header, content)),
    changeBookmark: (name: string, url: string, id: number) => dispatch(changeBookmark(name, url, id)),
    deleteBookmark: (id: number) => dispatch(deleteBookmark(id)),
    resetState: () => dispatch(bookmarksResetState())
});

export default connect(mapState, mapDispatch)(Bookmarks);

import { connect } from 'react-redux';
import { RootState } from '../../index';
import UserPage from '../../../components/UserPage/UserPage';
import { Action } from '../types';
import { Image } from '../../ImageViewer/types';
import { setImageList, setCurrentImage, clearImageList, openImageViewer } from '../actions';

const mapState = (state: RootState) => ({
    userPhoto: state.images.imageList
});

const mapDispatch = (dispatch: any) => ({
    setImageList: (payload: Image[]) => dispatch(setImageList(payload)),
    setCurrentImage: (payload: Image) => dispatch(setCurrentImage(payload)),
    clearImageList: () => dispatch(clearImageList),
    openImageViewer: () => dispatch(openImageViewer)
});

export default connect(mapState, mapDispatch)(UserPage);

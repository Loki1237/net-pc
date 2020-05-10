import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import UserPage from '../../components/UserPage/UserPage';
import { Image } from '../../store/ImageViewer/types';
import { 
    setImageList, 
    setCurrentImage, 
    clearImageList, 
    openImageViewer, 
    setAvatar 
} from '../../store/UserPage/actions';

const mapState = (state: RootState) => ({
    userPhoto: state.images.imageList,
    avatar: state.userState.avatar
});

const mapDispatch = (dispatch: any) => ({
    setImageList: (payload: Image[]) => dispatch(setImageList(payload)),
    setCurrentImage: (payload: Image) => dispatch(setCurrentImage(payload)),
    clearImageList: () => dispatch(clearImageList),
    openImageViewer: () => dispatch(openImageViewer),
    setAvatar: (payload: string) => dispatch(setAvatar(payload))
});

export default connect(mapState, mapDispatch)(UserPage);

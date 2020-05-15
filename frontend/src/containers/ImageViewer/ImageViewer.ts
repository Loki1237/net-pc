import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import ImageViewer from '../../components/ImageViewer/ImageViewer';
import { AppThunkDispatch } from '../../store/thunk';
import { 
    closeImageViewer,
    deleteImage,
    setAvatar,
    nextImage,
    prevImage
} from '../../store/ImageViewer/actions';

const mapState = (state: RootState) => ({
    isOpened: state.images.isOpened,
    imageList: state.images.imageList,
    currentImage: state.images.currentImage,
    currentIndex: state.images.index
});

const mapDispatch = (dispatch: AppThunkDispatch) => ({
    closeImageViewer: () => dispatch(closeImageViewer()),
    deleteImage: (id: number) => dispatch(deleteImage(id)),
    setAvatar: (avatar: string) => dispatch(setAvatar(avatar)),
    nextImage: () => dispatch(nextImage()),
    prevImage: () => dispatch(prevImage())
});

export default connect(mapState, mapDispatch)(ImageViewer);

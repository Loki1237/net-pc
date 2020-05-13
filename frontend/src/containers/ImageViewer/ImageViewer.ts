import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import ImageViewer from '../../components/ImageViewer/ImageViewer';
import { 
    closeImageViewer,
    deleteImage,
    setAvatar,
    switchImageNext,
    switchImagePrev
} from '../../store/ImageViewer/actions';

const mapState = (state: RootState) => ({
    isOpened: state.images.isOpened,
    imageList: state.images.imageList,
    currentImageIndex: state.images.currentImageIndex
});

const mapDispatch = (dispatch: Function) => ({
    closeImageViewer: () => dispatch(closeImageViewer()),
    deleteImage: (id: number) => dispatch(deleteImage(id)),
    setAvatar: (avatar: string) => dispatch(setAvatar(avatar)),
    switchImageNext: () => dispatch(switchImageNext()),
    switchImagePrev: () => dispatch(switchImagePrev())
});

export default connect(mapState, mapDispatch)(ImageViewer);

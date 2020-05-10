import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import ImageViewer from '../../components/ImageViewer/ImageViewer';
import { Image } from '../../store/ImageViewer/types';
import { 
    setCurrentImage, 
    setImageList, 
    closeImageViewer, 
    setAvatar 
} from '../../store/ImageViewer/actions';

const mapState = (state: RootState) => ({
    imageList: state.images.imageList,
    currentImage: state.images.currentImage,
    isOpened: state.images.isOpened
});

const mapDispatch = (dispatch: any) => ({
    closeImageViewer: () => dispatch(closeImageViewer),
    setImageList: (payload: Image[]) => dispatch(setImageList(payload)),
    setCurrentImage: (payload: Image) => dispatch(setCurrentImage(payload)),
    setAvatar: (payload: string) => dispatch(setAvatar(payload))
});

export default connect(mapState, mapDispatch)(ImageViewer);
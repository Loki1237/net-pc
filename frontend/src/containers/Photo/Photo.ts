import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import Photo from '../../components/Photo/Photo';
import { openImageViewer } from '../../store/ImageViewer/actions';
import { Image } from '../../store/ImageViewer/types';
import { 
    updatePhotoList, 
    createPhotos, 
    deletePhoto, 
    photosResetState 
} from '../../store/Photo/actions';

const mapState = (state: RootState) => ({
    isLoading: state.photos.isLoading,
    hasErrored: state.photos.hasErrored,
    photoList: state.photos.photoList,
    owner: state.photos.owner
});

const mapDispatch = (dispatch: Function) => ({
    updatePhotoList: (id: number) => dispatch(updatePhotoList(id)),
    createPhotos: (files: FormData) => dispatch(createPhotos(files)),
    deletePhoto: (id: number) => dispatch(deletePhoto(id)),
    resetState: () => dispatch(photosResetState()),
    openImageViewer: (payload: Image[], index: number) => dispatch(openImageViewer(payload, index))
});

export default connect(mapState, mapDispatch)(Photo);

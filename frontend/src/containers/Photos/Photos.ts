import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import Photos from '../../components/Photos/Photos';
import { openImageViewer } from '../../store/ImageViewer/actions';
import { Image } from '../../store/ImageViewer/types';
import { AppThunkDispatch } from '../../store/thunk';
import { 
    updatePhotoList, 
    createPhotos, 
    deletePhoto, 
    photosResetState 
} from '../../store/Photos/actions';

const mapState = (state: RootState) => ({
    isLoading: state.photos.isLoading,
    error: state.photos.error,
    photoList: state.photos.photoList,
    owner: state.photos.owner
});

const mapDispatch = (dispatch: AppThunkDispatch) => ({
    updatePhotoList: (id: number) => dispatch(updatePhotoList(id)),
    createPhotos: (files: FormData) => dispatch(createPhotos(files)),
    deletePhoto: (id: number) => dispatch(deletePhoto(id)),
    resetState: () => dispatch(photosResetState()),
    openImageViewer: (payload: Image[], index: number) => dispatch(openImageViewer(payload, index))
});

export default connect(mapState, mapDispatch)(Photos);

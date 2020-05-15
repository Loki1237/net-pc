import React from 'react';
import styles from './Styles.m.css';
import {
    Backdrop,
    Button,
    IconButton,
    Divider,
    Icon,
    Loading,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalWindow
} from '../../shared';

import { history } from '../../middleware';
import _ from 'lodash';
import { Photo } from '../../store/Photos/types';

interface Props {
    userId: number,
    urlParams: { id: string, action: string },
    isLoading: boolean,
    hasErrored: boolean,
    photoList: Photo[],
    owner: { name: string, id: number },
    updatePhotoList: (id: number) => void,
    createPhotos: (files: FormData) => void,
    deletePhoto: (id: number) => void,
    resetState: () => void,
    openImageViewer: (payload: Photo[], index: number) => void
};

class Photos extends React.Component<Props> {
    fileInput: React.RefObject<HTMLInputElement> = React.createRef();
    state = {
        newPhoto: {
            window: false,
            files: []
        }
    };

    componentDidMount() {
        this.urlParamsIdChangeHandler();
    }

    componentWillUnmount() {
        this.props.resetState();
    }

    componentDidUpdate(prevProps: Props) {
        const urlParams = this.props.urlParams;

        if (urlParams.id !== prevProps.urlParams.id) {
            this.urlParamsIdChangeHandler();
        } else if (urlParams.action !== prevProps.urlParams.action && urlParams.action === "update") {
            this.urlParamsIdChangeHandler();
            history.push(`/photo/${urlParams.id}`);
        }
    }

    urlParamsIdChangeHandler = () => {
        this.props.resetState();
        let id = +this.props.urlParams.id;
        this.props.updatePhotoList(id);
    }

    setNewPhotoWindow = (value: boolean) => {
        this.setState({ 
            newPhoto: {
                window: value,
                files: value ? [] : this.state.newPhoto.files,
            }
        });
    }

    setFiles = () => {
        if (!this.fileInput.current) {
            this.setNewPhotoWindow(true);
            return;
        }

        const fileList = this.fileInput.current.files;
        const files = [];

        if (!fileList) {
            this.setNewPhotoWindow(true);
            return;
        }

        for (let i = 0; i < fileList.length; i++) {
            files.push(URL.createObjectURL(fileList[i]));
        }

        this.setState({ newPhoto: {
            window: this.state.newPhoto.window,
            files
        } });
    }

    saveNewPhoto = async () => {
        if (!this.fileInput.current) {
            this.setNewPhotoWindow(true);
            return;
        }

        const fileList = this.fileInput.current.files;

        if (!fileList) {
            this.setNewPhotoWindow(true);
            return;
        }

        const files = new FormData();
        
        for (let i = 0; i < fileList.length; i++) {
            files.append("photo", fileList[i]);
        }

        this.props.createPhotos(files);
        this.setNewPhotoWindow(false);
    }

    openImage = (index: number) => {
        const photoList = this.props.photoList;
        this.props.openImageViewer(photoList, index);
    }

    renderLoading = () => (
        <div className={styles.Photo}>
            <Loading />
        </div>
    );

    renderError = () => (
        <div className={styles.Photo}>
            <h1>Error</h1>
        </div>
    );

    render() {
        if (this.props.hasErrored) {
            return this.renderError();
        } else if (this.props.isLoading) {
            return this.renderLoading();
        }

        return (
            <div className={styles.Photo}>
                <div className={styles.header}>
                    <span>
                        Фотографии - {this.props.owner.name}
                    </span>
                    {this.props.userId === this.props.owner.id && 
                        <Button color="primary" size="small"
                            onClick={() => this.setNewPhotoWindow(true)}
                        >
                            Добавить фото
                        </Button>
                    }
                </div>

                {/* ========== Все фотографии ========== */}
                <div className={styles.container}>
                    {this.props.photoList.map((photography, i, array) => {
                        const yearOfCurrentPhoto = new Date(+photography.timestamp).getFullYear();
                        let match = false;

                        if (i > 0) {
                            const yearOfPrevPhoto = new Date(+array[i - 1].timestamp).getFullYear();
                            match = yearOfCurrentPhoto === yearOfPrevPhoto;
                        }

                        return (
                            <React.Fragment key={"photo" + photography.id}>
                                {!match && <div key={"photo_year" + photography.id} className={styles.year_divider}>
                                    <span>{yearOfCurrentPhoto}</span>
                                </div>}

                                <div className={styles.photography} key={photography.id}>
                                    <img src={photography.url}
                                        onClick={() => this.openImage(i)}
                                    />
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* ========== Модалка: добавить фото ========== */}
                <Backdrop 
                    blackout
                    isOpened={this.state.newPhoto.window}
                    onClose={() => this.setNewPhotoWindow(false)}
                >
                    <ModalWindow size="large"
                        isOpened={this.state.newPhoto.window}
                    >
                        <ModalHeader>
                            <span>Новая фотография</span>
                            <IconButton onClick={() => this.setNewPhotoWindow(false)}>
                                <Icon img="cross" color="white" />
                            </IconButton>
                        </ModalHeader>
                        <ModalBody align="center">
                            <Divider spaceY={4} bg="transparent" />
                            <div className={styles.photo_file_input}>
                                <Button color="primary">
                                    <label>
                                        <input type="file" 
                                            ref={this.fileInput} 
                                            name="photo"
                                            multiple
                                            onChange={this.setFiles}
                                        />
                                    </label>
                                    Выберите фотографии
                                </Button>

                                <Divider spaceY={6} bg="transparent" />

                                {this.state.newPhoto.files.map((file, index) => (
                                    <img key={"preview_photo" + index} 
                                        src={file} 
                                        className={styles.preview_photo} 
                                    />
                                ))}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" 
                                onClick={this.saveNewPhoto}
                                disabled={!this.state.newPhoto.files.length}
                            >
                                Сохранить
                            </Button>
                        </ModalFooter>
                    </ModalWindow>
                </Backdrop>
            </div>
        );
    }
}

export default Photos;

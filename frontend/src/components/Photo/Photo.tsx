import React from 'react';
import styles from './Styles.m.css';
import {
    Backdrop,
    Button,
    IconButton,
    Divider,
    InputField,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalWindow,
    Row
} from '../../shared';

import { toast as notify } from 'react-toastify';
import _ from 'lodash';

import iconCrossWhite from '../../shared/icons/icon_cross_white.png';

import { Image } from '../../store/ImageViewer/types';

interface Props {
    userId: number,
    userPhoto: Image[],
    urlParams: any,
    setImageList: Function,
    setCurrentImage: Function,
    clearImageList: Function,
    openImageViewer: Function
}

interface State {
    currentUserId: number,
    ownerOfPhoto: string,
    newPhoto: {
        window: boolean,
        files: string[]
    }
}

class Photo extends React.Component<Props, State> {
    fileInput: React.RefObject<HTMLInputElement>;
    constructor(props: Props) {
        super(props);
        this.fileInput = React.createRef();
        this.state = {
            currentUserId: 0,
            ownerOfPhoto: "",
            newPhoto: {
                window: false,
                files: []
            }
        };
    }

    async componentDidMount() {
        await this.urlParamsIdChangeHandler();
    }

    async componentDidUpdate(prevProps: Props) {
        if (this.props.urlParams.id !== prevProps.urlParams.id) {
            this.urlParamsIdChangeHandler();
        }
    }

    urlParamsIdChangeHandler = async () => {
        let id = +this.props.urlParams.id;
        const resUserData = await fetch(`/api/users/get_user_data/${id}`);
        const userData = await resUserData.json();

        this.setState({ currentUserId: id, ownerOfPhoto: userData.name });
        this.updatePhotoList(id);
    }

    updatePhotoList = async (userId: number) => {
        const resPhoto = await fetch(`/api/photo/${userId}`);
        const photo = await resPhoto.json();

        this.props.setImageList(photo);
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

        await fetch(`/api/photo/multiple/${this.props.userId}`, {
            method: "POST",
            body: files
        });

        this.setNewPhotoWindow(false);
        this.updatePhotoList(this.state.currentUserId);
    }

    openImage = (image: Image) => {
        this.props.setCurrentImage(image);
        this.props.openImageViewer();
    }

    render() {
        return (
            <div className={styles.Photo}>
                <div className={styles.header}>
                    <span>
                        {this.state.currentUserId === this.props.userId
                            ? "Мои фотографии"
                            : `Фотографии - ${this.state.ownerOfPhoto}`
                        }
                    </span>
                    {this.props.userId === this.state.currentUserId && 
                        <Button color="primary" size="small"
                            onClick={() => this.setNewPhotoWindow(true)}
                        >
                            Добавить фото
                        </Button>
                    }
                </div>

                {/* ========== Все фотографии ========== */}
                <div className={styles.container}>
                    {this.props.userPhoto.map((photography, i, array) => {
                        const yearOfCurrentPhoto = new Date(+photography.timestamp).getFullYear();
                        let match: boolean;

                        if (i === 0) {
                            match = false;
                        } else {
                            const yearOfPrevPhoto = new Date(+array[i - 1].timestamp).getFullYear();
                            match = yearOfCurrentPhoto === yearOfPrevPhoto;
                        }

                        return (
                            <React.Fragment key={"photo_frgmnt" + photography.id}>
                                {!match && <div key={"photo_year" + photography.id} className={styles.year}>
                                    <span>{yearOfCurrentPhoto}</span>
                                </div>}

                                <div className={styles.photography} key={photography.id}>
                                    <img src={photography.url}
                                        onClick={() => this.openImage(photography)}
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
                                <img src={iconCrossWhite} width={18} height={18} />
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

export default Photo;

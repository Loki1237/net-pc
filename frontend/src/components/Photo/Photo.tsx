import React from 'react';
import styles from './Styles.m.css';
import {
    Backdrop,
    Button,
    IconButton,
    Divider,
    DropdownContainer,
    DropdownMenu,
    DropdownItem,
    InputField,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalImage,
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
    setImageList: Function,
    setCurrentImage: Function,
    clearImageList: Function,
    openImageViewer: Function
}

interface State {
    newPhoto: {
        window: boolean,
        fileName: string
    }
}

class Photo extends React.Component<Props, State> {
    fileInput: React.RefObject<HTMLInputElement>;
    constructor(props: Props) {
        super(props);
        this.fileInput = React.createRef();
        this.state = {
            newPhoto: {
                window: false,
                fileName: ""
            }
        };
    }

    async componentDidMount() {
        await this.updatePhotoList();
    }

    updatePhotoList = async () => {
        const resPhoto = await fetch(`/api/photo/${this.props.userId}`);
        const photo = await resPhoto.json();

        this.props.setImageList(photo);
    }

    setNewPhotoWindow = (value: boolean) => {
        this.setState({ 
            newPhoto: {
                window: value,
                fileName: "",
            }
        });
    }

    setFileName = () => {
        if (!this.fileInput.current) {
            this.setNewPhotoWindow(true);
            return;
        }

        const fileList = this.fileInput.current.files;

        if (!fileList) {
            this.setNewPhotoWindow(true);
            return;
        }

        this.setState({ newPhoto: {
            window: this.state.newPhoto.window,
            fileName: fileList.length ? fileList[0].name : ""
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
        files.append("photo", fileList[0]);

        await fetch(`/api/photo/${this.props.userId}`, {
            method: "POST",
            body: files
        });

        this.setNewPhotoWindow(false);
        this.updatePhotoList();
    }

    openImage = (image: Image) => {
        this.props.setCurrentImage(image);
        this.props.openImageViewer();
    }

    render() {
        return (
            <div className={styles.Photo}>
                <div className={styles.header}>
                    <span>Мои фотографии</span>
                    <Button color="primary" size="small"
                        onClick={() => this.setNewPhotoWindow(true)}
                    >
                        Добавить фото
                    </Button>
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
                    <ModalWindow>
                        <ModalHeader color="primary">
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
                                            onChange={this.setFileName}
                                        />
                                    </label>
                                    Выберите файл
                                </Button>

                                <InputField readOnly
                                    value={this.state.newPhoto.fileName}
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" 
                                onClick={this.saveNewPhoto}
                                disabled={!this.state.newPhoto.fileName}
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

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

import { getMyId, history } from '../../middleware';
import { toast as notify } from 'react-toastify';
import _ from 'lodash';

import iconBackGray from '../../shared/icons/icon_back_gray.png';
import iconNextGray from '../../shared/icons/icon_next_gray.png';
import iconCrossGray from '../../shared/icons/icon_cross_gray.png';
import iconCrossWhite from '../../shared/icons/icon_cross_white.png';

import Photo from './Photo';

interface PhotoType {
    id: number,
    userId: number,
    url: string,
    timestamp: string
}

interface PropsType {

}

interface StateType {
    photographies: PhotoType[],
    newPhoto: {
        window: boolean,
        fileName: string
    },
    showPhoto: {
        window: boolean,
        id: number | null,
        url: string,
        date: string,
        currentPhotoNumber: number
    }
}

const monthList = [
    "янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"
]

class Phototographies extends React.Component<PropsType, StateType> {
    fileInput: any;
    constructor(props: PropsType) {
        super(props);
        this.fileInput = React.createRef();
        this.state = {
            photographies: [],
            newPhoto: {
                window: false,
                fileName: ""
            },
            showPhoto: {
                window: false,
                id: null,
                url: "",
                date: "",
                currentPhotoNumber: 0
            }
        };
    }

    async componentDidMount() {
        await this.updatePhotoList();
    }

    updatePhotoList = async () => {
        const myId = await getMyId();
        const resPhoto = await fetch(`/api/photo/${myId}`);
        const photographies = await resPhoto.json();

        this.setState({ photographies });
    }

    setNewPhotoWindow = (value: boolean) => {
        this.setState({ 
            newPhoto: {
                window: value,
                fileName: "",
            }
        });
    }

    setShowPhotoWindow = (value: boolean, photo?: PhotoType) => {
        const { url, date, currentPhotoNumber } = this.state.showPhoto;
        this.setState({ 
            showPhoto: {
                window: value,
                id: photo ? photo.id : null,
                url: photo ? '/api/photo/' + photo.url : url,
                date: photo ? this.setDateFromTimestamp(photo.timestamp) : date,
                currentPhotoNumber: photo ? _.findIndex(this.state.photographies, { id: photo.id || 0 }) + 1 : currentPhotoNumber
            }
        });
    }

    setDateFromTimestamp = (miliseconds: string) => {
        const date = new Date(parseInt(miliseconds));

        let day = `${date.getDate()}`;
        day = day.length < 2 ? `0${day}` : day;
        let month = `${monthList[date.getMonth()]}`;
        let year = `${date.getFullYear()}`;
        
        return `${day} ${month}. ${year}`;
    }

    setFileName = () => {
        const files = this.fileInput.current.files;

        this.setState({ newPhoto: {
            window: this.state.newPhoto.window,
            fileName: files.length ? files[0].name : ""
        } });
    }

    saveNewPhoto = async (e: any) => {
        const myId = await getMyId();

        const files = new FormData();
        files.append("photo", this.fileInput.current.files[0]);

        await fetch(`/api/photo/${myId}`, {
            method: "POST",
            body: files
        });

        this.setNewPhotoWindow(false);
        this.updatePhotoList();
    }

    deletePhoto = async (id: number | null) => {
        if (id === null) return;

        await fetch(`api/photo/${id}`, { method: "DELETE" });

        this.setShowPhotoWindow(false);
        this.updatePhotoList();
    }

    switchPhoto = (direction: string) => {
        const currentPhotoIndex = _.findIndex(this.state.photographies, { id: this.state.showPhoto.id || 0 });
        const lastPhotoIndex = this.state.photographies.length - 1;

        if (
            currentPhotoIndex === 0 && direction === "back" ||
            currentPhotoIndex === lastPhotoIndex && direction === "next"
        ) {
            return;
        }

        const newIndex = direction === "back" ? currentPhotoIndex - 1 :
                         direction === "next" ? currentPhotoIndex + 1 : 0;
        const newPhoto = this.state.photographies[newIndex];
        
        this.setState({ showPhoto: {
            window: this.state.showPhoto.window,
            id: newPhoto.id,
            url: '/api/photo/' + newPhoto.url,
            date: this.setDateFromTimestamp(newPhoto.timestamp),
            currentPhotoNumber: newIndex + 1
        } });
    }

    render() {
        return (
            <div className={styles.Phototographies}>
                <div className={styles.header}>
                    <span>Мои фотографии</span>
                    <Button color="primary" size="small"
                        onClick={() => this.setNewPhotoWindow(true)}
                    >
                        Добавить фото
                    </Button>
                </div>

                <div className={styles.container}>
                    {this.state.photographies.map(photo => {
                        return (
                            <Photo key={photo.id} 
                                src={'/api/photo/' + photo.url}
                                onClick={() => this.setShowPhotoWindow(true, photo)}
                            />
                        );
                    })}
                </div>

                {/* ========== Модалка: добавить фото ==========*/}
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

                {/* ========== Модалка: открытое фото ==========*/}
                <Backdrop 
                    blackout
                    isOpened={this.state.showPhoto.window}
                    onClose={() => this.setShowPhotoWindow(false)}
                >
                    <ModalWindow size="very_large">
                        <ModalImage image={this.state.showPhoto.url}
                            backButton={
                                <IconButton box size="large"
                                    onClick={() => this.switchPhoto("back")}
                                >
                                    <img src={iconBackGray} width={32} height={32} style={{ marginRight: 5 }} />
                                </IconButton>
                            }
                            nextButton={
                                <IconButton box size="large"
                                    onClick={() => this.switchPhoto("next")}
                                >
                                    <img src={iconNextGray} width={32} height={32} style={{ marginLeft: 5 }} />
                                </IconButton>
                            }
                            closeButton={
                                <IconButton onClick={() => this.setShowPhotoWindow(false)}>
                                    <img src={iconCrossGray} width={18} height={18} />
                                </IconButton>
                            }
                        >
                            <span>
                                Фотография: {this.state.showPhoto.currentPhotoNumber} / {this.state.photographies.length}
                            </span>
                            <Divider spaceY={3} bg="transparent" />

                            <span>
                                Добавлено: {this.state.showPhoto.date}
                            </span>
                            <Divider spaceY={30} bg="transparent" />

                            <Button color="error" 
                                size="small"
                                style={{ width: 180 }}
                                onClick={() => this.deletePhoto(this.state.showPhoto.id)}
                            >
                                Удалить
                            </Button>
                            <Divider spaceY={3} bg="transparent" />

                            <Button color="info" 
                                size="small"
                                style={{ width: 180 }}
                                onClick={() => window.open(this.state.showPhoto.url)}
                            >
                                Открыть оригинал
                            </Button>
                            <Divider spaceY={3} bg="transparent" />
                        </ModalImage>
                    </ModalWindow>
                </Backdrop>
            </div>
        );
    }
}

export default Phototographies;

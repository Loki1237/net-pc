import React from 'react';
import styles from './Styles.m.css';
import classNames from 'classnames';
import _ from 'lodash';

import {
    Backdrop,
    DropdownMenu,
    DropdownItem,
    Icon,
    IconButton,
    ModalWindow
} from '../../shared';

import { Image } from '../../store/ImageViewer/types';

interface Props {
    userId: number,
    imageList: Image[],
    currentImageIndex: number,
    isOpened: boolean,
    closeImageViewer: () => void,
    switchImageNext: () => void,
    switchImagePrev: () => void,
    setAvatar: (avatar: string) => void,
    deleteImage: (id: number) => void
}

interface State {
    imageUrl: string,
    ownerId: number,
    creationDate: string,
    fullScreen: boolean
}

const monthList = [
    "янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"
]

class ImageViewer extends React.Component<Props, State> {
    viewerWindow: React.RefObject<HTMLDivElement> = React.createRef();
    state = {
        imageUrl: "",
        ownerId: 0,
        creationDate: "",
        fullScreen: false
    };

    componentDidUpdate(prevProps: Props) {
        const imageList = this.props.imageList;
        const currentImageIndex = this.props.currentImageIndex;

        if (this.props.isOpened &&
            (currentImageIndex !== prevProps.currentImageIndex || 
            this.props.isOpened !== prevProps.isOpened)
        ) {
            this.setState({
                imageUrl: imageList[currentImageIndex].url,
                creationDate: this.setDateFromTimestamp(imageList[currentImageIndex].timestamp)
            });
        }

        if (currentImageIndex !== prevProps.currentImageIndex && imageList[currentImageIndex].userId) {
            this.setState({ ownerId: imageList[currentImageIndex].userId });
        }

        if (this.props.isOpened !== prevProps.isOpened) {
            switch (this.props.isOpened) {
                case true:
                    document.addEventListener("keydown", this.keyboarHandler);
                    document.addEventListener("webkitfullscreenchange", this.fullScreenChangeHandler);
                    document.addEventListener("mozfullscreenchange", this.fullScreenChangeHandler);
                    document.addEventListener("fullscreenchange", this.fullScreenChangeHandler);
                    break;
                
                case false:
                    document.removeEventListener("keydown", this.keyboarHandler);
                    document.removeEventListener("webkitfullscreenchange", this.fullScreenChangeHandler);
                    document.removeEventListener("mozfullscreenchange", this.fullScreenChangeHandler);
                    document.removeEventListener("fullscreenchange", this.fullScreenChangeHandler);
            }
        }
    }

    fullScreenChangeHandler = () => {
        const fullscreenElement = document.fullscreenElement;
        this.setState({ fullScreen: fullscreenElement === this.viewerWindow.current });
    }

    launchFullScreen = () => {
        interface DivElement {
            requestFullScreen?: Function,
            mozRequestFullScreen?: Function,
            webkitRequestFullScreen?: Function
        }
        const element = this.viewerWindow.current as DivElement;

        if(element.requestFullScreen) {
            element.requestFullScreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if(element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    }

    keyboarHandler = (e: KeyboardEvent): void => {
        switch (e.key) {
            case "ArrowLeft":
                this.props.switchImagePrev();
                break;

            case "ArrowRight":
                this.props.switchImageNext();
                break;

            case "Enter":
                this.launchFullScreen();
                break;
        }
    }

    setDateFromTimestamp = (miliseconds: string) => {
        const date = new Date(parseInt(miliseconds));

        let day = `${date.getDate()}`;
        day = day.length < 2 ? `0${day}` : day;
        let month = `${monthList[date.getMonth()]}`;
        let year = `${date.getFullYear()}`;
        
        return `${day} ${month}. ${year}`;
    }

    deleteImage = () => {
        const imageList = this.props.imageList;
        const currentImageIndex = this.props.currentImageIndex;

        if (imageList[currentImageIndex].userId !== this.props.userId) {
            return;
        }

        this.props.deleteImage(imageList[currentImageIndex].id);
        this.props.closeImageViewer();
    }

    setAvatar = () => {
        const imageList = this.props.imageList;
        const currentImageIndex = this.props.currentImageIndex;
        this.props.setAvatar(imageList[currentImageIndex].url);
    }

    openOriginalImage = () => {
        const imageList = this.props.imageList;
        const currentImageIndex = this.props.currentImageIndex;
        window.open(imageList[currentImageIndex].url);
    }

    render() {
        const imageList = this.props.imageList;
        const currentImageIndex = this.props.currentImageIndex;

        return (
            <div>
                <Backdrop blackout 
                    isOpened={this.props.isOpened}
                    onClose={this.props.closeImageViewer}
                >
                    <ModalWindow size="very_large"
                        isOpened={this.props.isOpened}
                    >
                        <div className={styles.ImageViewer} ref={this.viewerWindow}>
                            {!this.state.fullScreen && 
                                <div className={styles.header}>
                                    <span>
                                        Добавлено: {this.state.creationDate}
                                    </span>

                                    <span>
                                        Фотографии: {currentImageIndex + 1} / {imageList.length}
                                    </span>
                                    
                                    <div className={styles.actions}>
                                        <button onClick={this.launchFullScreen}>
                                            <Icon img="deploy" color="white" size="small" />
                                        </button>

                                        <DropdownMenu arrow
                                            placement="right"
                                            control={
                                                <button>
                                                    <Icon img="more_horizontal" color="white" />
                                                </button>
                                            }
                                        >
                                            <DropdownItem onClick={this.openOriginalImage}>
                                                Открыть оригинал
                                            </DropdownItem>

                                            {this.state.ownerId === this.props.userId && 
                                                <DropdownItem onClick={this.setAvatar}>
                                                    Установить как фото профиля
                                                </DropdownItem>
                                            }

                                            {this.state.ownerId === this.props.userId && 
                                                <DropdownItem onClick={this.deleteImage}>
                                                    Удалить фото
                                                </DropdownItem>
                                            }
                                        </DropdownMenu>
                                    </div>

                                    <IconButton size="small" onClick={this.props.closeImageViewer}>
                                        <Icon img="cross" color="white" size="small" />
                                    </IconButton>
                                </div>
                            }

                            <div className={styles.image_container}>
                                <div className={classNames(styles.navigation, styles.back)} 
                                    onClick={this.props.switchImagePrev}>
                                </div>

                                <img className={styles.image}
                                    src={this.state.imageUrl}
                                />
                                
                                <div className={classNames(styles.navigation, styles.next)}
                                    onClick={this.props.switchImageNext}>
                                </div>
                            </div>

                            {this.state.fullScreen && 
                                <p className={styles.navigation_info}>
                                    {currentImageIndex + 1} / {this.props.imageList.length}
                                </p>
                            }
                        </div>
                    </ModalWindow>
                </Backdrop>
            </div>
        );
    }
}

export default ImageViewer;

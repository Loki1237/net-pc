import React from 'react';
import styles from './Styles.m.css';
import classNames from 'classnames';
import _ from 'lodash';
import { DateFromTimestamp } from '../../middleware';

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
    currentImage: Image,
    currentIndex: number,
    isOpened: boolean,
    closeImageViewer: () => void,
    nextImage: () => void,
    prevImage: () => void,
    setAvatar: (avatar: string) => void,
    deleteImage: (id: number) => void
}

class ImageViewer extends React.Component<Props> {
    viewerWindow: React.RefObject<HTMLDivElement> = React.createRef();
    state = {
        creationDate: "",
        fullScreen: false
    };

    componentDidUpdate(prevProps: Props) {
        if (this.props.isOpened && this.props.currentImage.id !== prevProps.currentImage.id) {
            const date = new DateFromTimestamp(this.props.currentImage.timestamp);

            this.setState({
                creationDate: `${date.getDate()} ${date.getYear()}`
            });
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
                this.props.prevImage();
                break;

            case "ArrowRight":
                this.props.nextImage();
                break;

            case "Enter":
                this.launchFullScreen();
                break;
        }
    }

    deleteImage = () => {
        if (this.props.currentImage.userId !== this.props.userId) {
            return;
        }

        this.props.deleteImage(this.props.currentImage.id);
        this.props.closeImageViewer();
    }

    setAvatar = () => {
        this.props.setAvatar(this.props.currentImage.url);
    }

    openOriginalImage = () => {
        window.open(this.props.currentImage.url);
    }

    render() {
        const { imageList, currentImage, currentIndex } = this.props;

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
                                    <div className={styles.info}>
                                        Добавлено: {this.state.creationDate}
                                    </div>

                                    <div className={styles.info}>
                                        Фотографии: {currentIndex + 1} / {imageList.length}
                                    </div>
                                    
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

                                            {currentImage.userId === this.props.userId && 
                                                <DropdownItem onClick={this.setAvatar}>
                                                    Установить как фото профиля
                                                </DropdownItem>
                                            }

                                            {currentImage.userId === this.props.userId && 
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
                                    onClick={this.props.prevImage}>
                                </div>

                                <img className={styles.image}
                                    src={this.props.currentImage.url}
                                />
                                
                                <div className={classNames(styles.navigation, styles.next)}
                                    onClick={this.props.nextImage}>
                                </div>
                            </div>

                            {this.state.fullScreen && 
                                <p className={styles.navigation_info}>
                                    {currentIndex + 1} / {this.props.imageList.length}
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

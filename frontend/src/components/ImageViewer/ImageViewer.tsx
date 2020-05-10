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
    currentImage: Image,
    isOpened: boolean,
    closeImageViewer: VoidFunction,
    setImageList: Function,
    setCurrentImage: Function,
    setAvatar: Function
}

interface State {
    currentImage: number,
    ownerOfPhoto: string,
    creationDate: string,
    fullScreen: boolean
}

const monthList = [
    "янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"
]

class ImageViewer extends React.Component<Props, State> {
    private viewerWindow: React.RefObject<HTMLDivElement>;
    constructor(props: Props) {
        super(props);
        this.viewerWindow = React.createRef();
        this.state = {
            currentImage: 0,
            ownerOfPhoto: "",
            creationDate: "",
            fullScreen: false
        };
    }

    fullScreenChangeHandler = () => {
        const fullscreenElement = document.fullscreenElement;
        this.setState({ fullScreen: fullscreenElement === this.viewerWindow.current });
    }

    async componentDidUpdate(prevProps: Props) {
        if (this.props.currentImage.id !== prevProps.currentImage.id) {
            const index = _.findIndex(this.props.imageList, { id: this.props.currentImage.id });
            this.setState({ 
                currentImage: index + 1,
                creationDate: this.setDateFromTimestamp(this.props.currentImage.timestamp)
            });
        }

        if (this.props.currentImage.userId !== prevProps.currentImage.userId) {
            const resUserData = await fetch(`/api/users/get_user_data/${this.props.currentImage.userId}`);
            const userData = await resUserData.json();
            this.setState({ ownerOfPhoto: userData.name.split(" ")[0] });
        }

        if (this.props.isOpened !== prevProps.isOpened && this.props.isOpened) {
            document.addEventListener("keydown", this.keyboarHandler);
            document.addEventListener("webkitfullscreenchange", this.fullScreenChangeHandler);
            document.addEventListener("mozfullscreenchange", this.fullScreenChangeHandler);
            document.addEventListener("fullscreenchange", this.fullScreenChangeHandler);
        }

        if (this.props.isOpened !== prevProps.isOpened && !this.props.isOpened) {
            document.removeEventListener("keydown", this.keyboarHandler);
            document.removeEventListener("webkitfullscreenchange", this.fullScreenChangeHandler);
            document.removeEventListener("mozfullscreenchange", this.fullScreenChangeHandler);
            document.removeEventListener("fullscreenchange", this.fullScreenChangeHandler);
        }
    }

    keyboarHandler = (e: KeyboardEvent): void => {
        switch (e.key) {
            case "ArrowLeft":
                this.switchImage("back");
                break;

            case "ArrowRight":
                this.switchImage("next");
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

    deleteImage = async () => {
        if (this.props.currentImage.userId !== this.props.userId) {
            return;
        }

        await fetch(`api/photo/${this.props.currentImage.id}`, { method: "DELETE" });

        const resUserData = await fetch(`/api/users/get_user_data/${this.props.userId}`);
        const userData = await resUserData.json();

        if (userData.avatar === this.props.currentImage.url) {
            await this.setAvatar("none");
        }

        this.setState({ currentImage: this.state.currentImage - 1 });
        this.updateImageList();
        this.props.closeImageViewer();
    }

    setAvatar = async (avatar: string) => {
        await fetch(`/api/users/set_avatar/${this.props.userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({
                avatar
            })
        });

        this.props.setAvatar(avatar);
    }

    updateImageList = async () => {
        const resPhoto = await fetch(`/api/photo/${this.props.userId}`);
        const photo = await resPhoto.json();

        this.props.setImageList(photo);
    }

    switchImage = (direction: string) => {
        const index = _.findIndex(this.props.imageList, { id: this.props.currentImage.id });
        const lastIndex = this.props.imageList.length - 1;
        let newIndex = direction === "back" ? index - 1 :
                       direction === "next" ? index + 1 : 0;

        if (index === 0 && direction === "back") {
            newIndex = lastIndex;
        }

        if (index === lastIndex && direction === "next") {
            newIndex = 0;
        }
        
        const newPhoto = this.props.imageList[newIndex];

        this.props.setCurrentImage(newPhoto);
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

    render() {
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
                            <div className={styles.header}>
                                {!this.state.fullScreen &&
                                    <span>
                                        Добавлено: {this.state.creationDate}
                                    </span>
                                }

                                <span>
                                    {this.props.currentImage.userId === this.props.userId
                                        ? "Мои фотографии"
                                        : `Фотографии (${this.state.ownerOfPhoto})`}
                                            : {this.state.currentImage} / {this.props.imageList.length}
                                </span>

                                {!this.state.fullScreen && 
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
                                            <DropdownItem
                                                onClick={() => window.open(this.props.currentImage.url)}
                                            >
                                                Открыть оригинал
                                            </DropdownItem>

                                            {this.props.currentImage.userId === this.props.userId && 
                                                <DropdownItem
                                                    onClick={() => this.setAvatar(this.props.currentImage.url)}
                                                >
                                                    Установить как фото профиля
                                                </DropdownItem>
                                            }

                                            {this.props.currentImage.userId === this.props.userId && 
                                                <DropdownItem
                                                    onClick={this.deleteImage}
                                                >
                                                    Удалить фото
                                                </DropdownItem>
                                            }
                                        </DropdownMenu>
                                    </div>
                                }

                                {!this.state.fullScreen && 
                                    <IconButton size="small" onClick={this.props.closeImageViewer}>
                                        <Icon img="cross" color="white" size="small" />
                                    </IconButton>
                                }
                            </div>

                            <div className={styles.image_container}>
                                <div className={classNames(styles.navigation, styles.back)} 
                                    onClick={() => this.switchImage("back")}>
                                </div>

                                <img className={styles.image} src={this.props.currentImage.url} />
                                
                                <div className={classNames(styles.navigation, styles.next)}
                                    onClick={() => this.switchImage("next")}>
                                </div>
                            </div>
                        </div>
                    </ModalWindow>
                </Backdrop>
            </div>
        );
    }
}

export default ImageViewer;

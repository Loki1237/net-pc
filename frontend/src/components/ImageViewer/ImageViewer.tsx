import React from 'react';
import styles from './Styles.m.css';

import _ from 'lodash';

import {
    Backdrop,
    DropdownContainer,
    DropdownMenu,
    DropdownItem,
    IconButton,
    ModalWindow
} from '../../shared';

import iconCrossGray from '../../shared/icons/icon_cross_gray.png';
import iconCrossWhite from '../../shared/icons/icon_cross_white.png';
import iconMoreHorWhite from '../../shared/icons/icon_more_hor_white.png';

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
    creationDate: string
}

const monthList = [
    "янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"
]

class ImageWindow extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            currentImage: 0,
            creationDate: ""
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.currentImage.id !== prevProps.currentImage.id) {
            const index = _.findIndex(this.props.imageList, { id: this.props.currentImage.id });
            this.setState({ 
                currentImage: index + 1,
                creationDate: this.setDateFromTimestamp(this.props.currentImage.timestamp)
            });
        }

        if (this.props.isOpened !== prevProps.isOpened && this.props.isOpened) {
            document.addEventListener("keydown", this.keyboarHandler);
        }

        if (this.props.isOpened !== prevProps.isOpened && !this.props.isOpened) {
            document.removeEventListener("keydown", this.keyboarHandler);
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

    render() {
        return (
            <div>
                <Backdrop blackout 
                    isOpened={this.props.isOpened}
                    onClose={this.props.closeImageViewer}
                >
                    <ModalWindow size="very_large">
                        <div className={styles.ImageViewer}>
                            <div className={styles.header}>
                                <span>
                                    Добавлено: {this.state.creationDate}
                                </span>

                                <span>
                                    Фотография: {this.state.currentImage} / {this.props.imageList.length}
                                </span>

                                <div className={styles.actions}>
                                    <button onClick={() => window.open(this.props.currentImage.url)}>
                                        Открыть оригинал
                                    </button>

                                    <DropdownContainer>
                                        <button onClick={() => {}}>
                                            {[1, 2, 3].map(num => <div key={num} className={styles.dot}></div>)}
                                        </button>
                                        <DropdownMenu placement="right"
                                            arrow={{ right: 16 }}
                                        >
                                            {this.props.currentImage.userId === this.props.userId && 
                                                <DropdownItem
                                                    onClick={this.deleteImage}
                                                >
                                                    Удалить фото
                                                </DropdownItem>
                                            }

                                            <DropdownItem
                                                onClick={() => this.setAvatar(this.props.currentImage.url)}
                                            >
                                                Установить как фото профиля
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </DropdownContainer>
                                </div>

                                <IconButton size="small" onClick={this.props.closeImageViewer}>
                                    <img src={iconCrossWhite} width={14} height={14} />
                                </IconButton>
                            </div>

                            <div className={styles.image_container}>
                                <div className={`${styles.navigation} ${styles.back}`} 
                                    onClick={() => this.switchImage("back")}>
                                </div>

                                <img className={styles.image} src={this.props.currentImage.url} />
                                
                                <div className={`${styles.navigation} ${styles.next}`}
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

export default ImageWindow;

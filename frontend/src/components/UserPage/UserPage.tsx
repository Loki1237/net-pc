import React from 'react';
import styles from './styles/UserPage.m.css';
import defaultAvatar from '../../assets/images/default_avatar.png';

import {
    Backdrop,
    Button,
    IconButton,
    Divider,
    DropdownMenu,
    DropdownItem,
    Icon,
    Loading,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalWindow,
    Row,
    TextArea
} from '../../shared';

import DataField from './DataField';
import { Link } from 'react-router-dom';
import { history } from '../../middleware';
import _ from "lodash";

import { User } from '../../store/UserPage/types';
import { Photo } from '../../store/Photos/types';

interface Props {
    userId: number,
    urlParams: { id: string, action: string },
    isLoading: boolean,
    hasErrored: boolean,
    currentUser: User,
    photoList: Photo[],
    updateUserData: (id: number) => void,
    changeAvatar: (file: FormData) => void,
    resetAvatar: () => void,
    resetState: () => void,
    openImageViewer: (payload: Photo[], index: number) => void
};

class UserPage extends React.Component<Props> {
    fileInput: React.RefObject<HTMLInputElement> = React.createRef();
    state = {
        changeAvatar: {
            window: false,
            preview: ""
        },
        writeMessage: {
            window: false,
            message: ""
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
            history.push(`/usr/${urlParams.id}`);
        }
    }

    urlParamsIdChangeHandler = () => {
        let id = +this.props.urlParams.id;
        this.props.updateUserData(id);
    }

    avatarHandler = async () => {
        if (!this.props.currentUser.avatar && this.props.currentUser.id !== this.props.userId) {
            return;
        }

        if (!this.props.currentUser.avatar) {
            this.setChangeAvatarWindow(true);
        } else {
            const index = _.findIndex(this.props.photoList, { url: this.props.currentUser.avatar })
            this.openImage(index);
        }
    }

    setChangeAvatarWindow = (value: boolean) => {
        this.setState({ changeAvatar: {
            window: value,
            preview: value ? "" : this.state.changeAvatar.preview
        } });
    }

    setFile = () => {
        if (!this.fileInput.current) {
            this.setChangeAvatarWindow(true);
            return;
        }

        const fileList = this.fileInput.current.files;

        if (!fileList) {
            this.setChangeAvatarWindow(true);
            return;
        }

        const url = URL.createObjectURL(fileList[0]);

        this.setState({ 
            changeAvatar: {
                window: this.state.changeAvatar.window,
                preview: url
            }
        });
    }

    uploadAvatar = () => {
        if (!this.fileInput.current) {
            this.setChangeAvatarWindow(true);
            return;
        }

        const fileList = this.fileInput.current.files;

        if (!fileList) {
            this.setChangeAvatarWindow(true);
            return;
        }

        const files = new FormData();
        files.append("photo", fileList[0]);
        this.props.changeAvatar(files);
        this.setChangeAvatarWindow(false);
    }

    setWriteMessageWindow = (value: boolean) => {
        this.setState({ writeMessage: {
            window: value,
            message: ""
        } });
    }

    writeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ writeMessage: {
            ...this.state.writeMessage,
            message: e.target.value
        } });
    }

    sendMessage = () => {
        alert(this.state.writeMessage.message);
    }

    openImage = (index: number) => {
        const photoList = this.props.photoList;
        this.props.openImageViewer(photoList, index);
    }

    renderLoading = () => (
        <div className={styles.UserPage}>
            <Loading />
        </div>
    );

    renderError = () => (
        <div className={styles.UserPage}>
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
            <div className={styles.UserPage}>
                <div className={styles.left_column}>

                    {/* ========== Аватар ========== */}
                    <div className={styles.avatar_container}
                        onClick={this.avatarHandler}
                    >
                        <img src={this.props.currentUser.avatar || defaultAvatar} 
                            className={styles.avatar_photo}
                            alt="*" 
                        />
                        <div className={styles.edit_avatar}
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                            {this.props.currentUser.id === this.props.userId && 
                                <DropdownMenu arrow
                                    placement="right"
                                    control={
                                        <IconButton size="small">
                                            <Icon img="edit" color="gray" size="small" />
                                        </IconButton>
                                    }
                                >
                                    <DropdownItem onClick={() => this.setChangeAvatarWindow(true)}>
                                        Сменить фото
                                    </DropdownItem>

                                    <DropdownItem onClick={() => this.props.resetAvatar()}>
                                        Удалить фото
                                    </DropdownItem>
                                </DropdownMenu>
                            }
                        </div>
                    </div>

                    <Divider spaceY={8} bg="transparent" />

                    {this.props.currentUser.id !== this.props.userId && 
                        <Button color="primary" 
                            style={{ width: "100%" }}
                            onClick={() => this.setWriteMessageWindow(true)}
                        >
                            Написать
                        </Button>
                    }
                </div>

                {/* ========== Данные пользователя ========== */}
                <div className={styles.right_column}>
                    <div className={styles.user_data}>
                        <div className={styles.header}>
                            <span>
                                {this.props.currentUser.name}
                            </span>
                        </div>

                        {Object.entries(this.props.currentUser).map((item, i, arr) => {
                            return (
                                <React.Fragment key={item[0]}>
                                    {i === 0 && <p className={styles.user_data_header}>
                                        Основная информация:
                                    </p>}

                                    {item[0] === "activity" && <p className={styles.user_data_header}>
                                        Дополнительная информация:
                                    </p>}

                                    <DataField name={item[0]} value={item[1]} />
                                </React.Fragment>
                            )
                        })}
                    </div>
                </div>

                {/* ========== Контейнер фотографий ========== */}
                <div className={styles.container}>
                    <Link to={`/photo/${this.props.currentUser.id}`}
                        className={styles.container_header}
                    >
                        Фотографии ({this.props.photoList.length})
                    </Link>

                    {this.props.photoList.slice(0, 5).map((photography, index) => (
                        <img key={photography.id}
                            src={photography.url} 
                            className={styles.photography}
                            onClick={() => this.openImage(index)}
                        />
                    ))}
                </div>

                {/* ========== Модалка: загрузить аватар ========== */}
                <Backdrop blackout
                    isOpened={this.state.changeAvatar.window}
                    onClose={() => this.setChangeAvatarWindow(false)}
                >
                    <ModalWindow size="large" 
                        isOpened={this.state.changeAvatar.window}
                    >
                        <ModalHeader>
                            <span>Загрузить фото</span>
                            <IconButton onClick={() => this.setChangeAvatarWindow(false)}>
                                <Icon img="cross" color="white" />
                            </IconButton>
                        </ModalHeader>
                        <ModalBody align="center">
                            <div className={styles.avatar_file_input}>
                                <Button color="info">
                                    <label>
                                        <input type="file" 
                                            ref={this.fileInput} 
                                            name="photo"
                                            onChange={this.setFile}
                                        />
                                    </label>
                                    Выберите изображение
                                </Button>

                                <Divider spaceY={4} />

                                {this.state.changeAvatar.preview &&
                                    <img src={this.state.changeAvatar.preview} />
                                }
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary"
                                disabled={!this.state.changeAvatar.preview}
                                onClick={this.uploadAvatar}
                            >
                                Сохранить
                            </Button>
                        </ModalFooter>
                    </ModalWindow>
                </Backdrop>

                {/* ========== Модалка: написать сообщение ========== */}
                <Backdrop 
                    blackout
                    isOpened={this.state.writeMessage.window}
                    onClose={() => this.setWriteMessageWindow(false)}
                >
                    <ModalWindow isOpened={this.state.writeMessage.window}>
                        <ModalHeader>
                            <span>Сообщение</span>
                            <IconButton onClick={() => this.setWriteMessageWindow(false)}>
                                <Icon img="cross" color="white" />
                            </IconButton>
                        </ModalHeader>
                        <ModalBody align="center">
                            <TextArea minRows={5} maxRows={10}
                                label="Сообщение:"
                                name="message"
                                value={this.state.writeMessage.message}
                                onChange={this.writeMessage}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" 
                                disabled={!this.state.writeMessage.message}
                                onClick={this.sendMessage}
                            >
                                Отправить
                            </Button>
                        </ModalFooter>
                    </ModalWindow>
                </Backdrop>
            </div>
        );
    }
}

export default UserPage;

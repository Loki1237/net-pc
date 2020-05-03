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
    Loading,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalImage,
    ModalWindow,
    Row
} from '../../shared';

import { getMyId, history } from '../../middleware';
import { toast as notify } from 'react-toastify';
import _ from "lodash";

import iconEditGray from '../../shared/icons/icon_edit_gray.png';
import iconCrossWhite from '../../shared/icons/icon_cross_white.png';
import iconCrossGray from '../../shared/icons/icon_cross_gray.png';
import defaultAvatar from '../../images/default_avatar.png';

import { Image } from '../../store/ImageViewer/types';

interface Props {
    userId: number,
    urlParams?: any,
    userPhoto: Image[],
    avatar: string,
    setAvatar: Function,
    setImageList: Function,
    setCurrentImage: Function,
    clearImageList: Function,
    openImageViewer: Function
}

interface State {
    currentUserId: number | null,
    avatar: string,
    userName: string,
    basicInfo: any[],
    additInfo: any[],
    changeAvatar: {
        window: boolean,
        preview: string
    }
}

const fieldNames: any = {
    gender: "Пол",
    birthday: "День рождения",
    country: "Страна",
    city: "Город",
    family_status: "Семейное положение",
    activity: "Деятельность",
    interests: "Интересы",
    hobby: "Хобби",
    about_self: "О себе"
}

const genderField: any = {
    male: "Мужской",
    female: "Женский"
}

const maleFamilyStatus: any = {
    married: "Женат",
    free: "Свободен",
    has_partner: "Есть девушка",
    want_meet: "Познакомлюсь",
    not_selected: "Не выбрано"
}

const femaleFamilyStatus: any = {
    married: "Замужем",
    free: "Свободна",
    has_partner: "Есть парень",
    want_meet: "Познакомлюсь",
    not_selected: "Не выбрано"
}

class UserPage extends React.Component<Props, State> {
    private fileInput: React.RefObject<HTMLInputElement>;
    constructor(props: Props) {
        super(props);
        this.fileInput = React.createRef();
        this.state = {
            currentUserId: null,
            avatar: "",
            userName: "",
            basicInfo: [],
            additInfo: [],
            changeAvatar: {
                window: false,
                preview: ""
            }
        };
    }

    async componentDidMount() {
        await this.urlParamsIdChangeHandler();
    }

    componentWillUnmount() {
        this.props.clearImageList();
    }

    async componentDidUpdate(prevProps: any) {
        if (this.props.urlParams.id !== prevProps.urlParams.id) {
            this.urlParamsIdChangeHandler();
        }
    }

    urlParamsIdChangeHandler = async () => {
        let id = +this.props.urlParams.id;

        this.setState({ currentUserId: id });
        setTimeout(() => this.updateUserData(), 10);
    }

    updateUserData = async() => {
        const resUserData = await fetch(`/api/users/get_user_data/${this.state.currentUserId}`);
        const resUserPhoto = await fetch(`/api/photo/${this.state.currentUserId}`);
        const userData = await resUserData.json();
        const userPhoto = await resUserPhoto.json();
        
        const basicInfo: any[] = [];
        const additInfo: any[] = [];

        for (let prop in userData) {
            if (/^(gender|birthday|country|city|family_status)$/.test(prop)) {
                let value = userData[prop];
                if (prop === "gender") {
                    value = genderField[userData[prop]];
                } else if (prop === "family_status" && userData.gender === "male") {
                    value = maleFamilyStatus[userData[prop]];
                } else if (prop === "family_status" && userData.gender === "female") {
                    value = femaleFamilyStatus[userData[prop]];
                }

                basicInfo.push([
                    fieldNames[prop], 
                    value
                    
                ]);
            } else if (/^(activity|interests|hobby|about_self)$/.test(prop) && userData[prop]) {
                additInfo.push([
                    fieldNames[prop], 
                    userData[prop]
                ]);
            }
        }

        this.setState({ 
            userName: userData.name,
            avatar: userData.avatar !== "none" ? userData.avatar : defaultAvatar,
            basicInfo,
            additInfo
        });

        this.props.setAvatar(userData.avatar);
        this.props.setImageList(userPhoto);
    }

    avatarHandler = async () => {
        const resUserData = await fetch(`/api/users/get_user_data/${this.state.currentUserId}`);
        const userData = await resUserData.json();

        if (userData.avatar ==="none" && this.state.currentUserId !== this.props.userId) {
            return;
        }

        if (userData.avatar ==="none") {
            this.setChangeAvatarWindow(true);
        } else {
            const index = _.findIndex(this.props.userPhoto, { url: this.state.avatar })
            this.openImage(this.props.userPhoto[index]);
        }
    }

    setUserAvatar = async (avatar: string) => {
        await fetch(`/api/users/set_avatar/${this.props.userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({
                avatar
            })
        });

        this.updateUserData();
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

    uploadAvatar = async () => {
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

        const resPhoto = await fetch(`/api/photo/${this.props.userId}`, {
            method: "POST",
            body: files
        });
        const res = await resPhoto.json();

        await this.setUserAvatar(res.url);

        this.setChangeAvatarWindow(false);
        this.updateUserData();
    }

    setChangeAvatarWindow = (value: boolean) => {
        this.setState({ changeAvatar: {
            window: value,
            preview: value ? "" : this.state.changeAvatar.preview
        } });
    }

    openImage = (image: Image) => {
        this.props.setCurrentImage(image);
        this.props.openImageViewer();
    }

    render() {
        return (
            <div className={styles.UserPage}>

                <div className={styles.left_column}>
                    <div className={styles.avatar_container}
                        onClick={this.avatarHandler}
                    >
                        <img src={this.props.avatar} 
                            className={styles.avatar_photo}
                            width="200" height="200" alt="*" 
                        />
                        <div className={styles.edit_avatar}
                            onClick={(e: any) => e.stopPropagation()}
                        >
                            {this.state.currentUserId === this.props.userId && 
                                <DropdownContainer>
                                    <IconButton size="small">
                                        <img src={iconEditGray} width={12} height={12} />
                                    </IconButton>
                                    <DropdownMenu placement="right"
                                        arrow={{ right: 9 }}
                                    >
                                        <DropdownItem onClick={() => this.setChangeAvatarWindow(true)}>
                                            Сменить фото
                                        </DropdownItem>

                                        <DropdownItem onClick={() => this.setUserAvatar("none")}>
                                            Удалить фото
                                        </DropdownItem>
                                    </DropdownMenu>
                                </DropdownContainer>
                            }
                        </div>
                    </div>

                    <Divider spaceY={8} bg="transparent" />

                    {this.state.currentUserId !== this.props.userId && 
                        <Button color="primary" style={{ width: "100%" }}>
                            Написать
                        </Button>
                    }
                </div>

                <div className={styles.right_column}>
                    <div className={styles.user_data}>
                        <div className={styles.header}>
                            <span>
                                {this.state.userName}
                            </span>
                        </div>

                        <Divider spaceY={8} />

                        <p className={styles.user_data_header}>Основная информация:</p>

                        <table className={styles.user_data_table}>
                            <tbody>
                                {this.state.basicInfo.map((prop, index) => {
                                    return (
                                        <tr key={"bscnf" + index}>
                                            <td>{prop[0]}:</td>
                                            <td>{prop[1]}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>

                        <Divider spaceY={8} />

                        <p className={styles.user_data_header}>Дополнительная информация:</p>
                        
                        <table className={styles.user_data_table}>
                            <tbody>
                                {this.state.additInfo.map((prop, index) => {
                                    return (
                                        <tr key={"ddtnf" + index}>
                                            <td>{prop[0]}:</td>
                                            <td>{prop[1]}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>

                    </div>
                </div>

                <div className={styles.container}>
                    <header>Фотографии ({this.props.userPhoto.length})</header>

                    {this.props.userPhoto.slice(0, 5).map(photography => (
                        <img key={photography.id}
                            src={photography.url} 
                            className={styles.photography}
                            onClick={() => this.openImage(photography)}
                        />
                    ))}
                </div>

                <Backdrop blackout
                    isOpened={this.state.changeAvatar.window}
                    onClose={() => this.setChangeAvatarWindow(false)}
                >
                    <ModalWindow size="large">
                        <ModalHeader>
                            <span>Загрузить фото</span>
                            <IconButton onClick={() => this.setChangeAvatarWindow(false)}>
                                <img src={iconCrossWhite} width={18} height={18} />
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
            </div>
        );
    }
}

export default UserPage;

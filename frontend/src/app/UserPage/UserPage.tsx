import React from 'react';
import styles from './UserPage.m.css';
import Backdrop from '../../components/Backdrop/Backdrop';
import ModalWindow from '../../components/Modal/ModalWindow';
import ModalHeader from '../../components/Modal/ModalHeader';
import ModalBody from '../../components/Modal/ModalBody';
import ModalFooter from '../../components/Modal/ModalFooter';
import Button from '../../components/Button/Button';
import IconButton from '../../components/IconButton/IconButton';
import DropdownContainer from '../../components/Dropdown/DropdownContainer';
import DropdownMenu from '../../components/Dropdown/DropdownMenu';
import DropdownItem from '../../components/Dropdown/DropdownItem';
import Divider from '../../components/Divider/Divider';
import Tooltip from '../../components/Tooltip/Tooltip';
import Loading from '../../components/Loading/Loading';

import { getMyId } from '../middleware';
import { toast as notify } from 'react-toastify';

import defaultAvatar from '../../images/default_avatar.png';
import iconEditGray from '../../components/icons/icon_edit_gray.png';

interface PropsType {
    
}

interface StateType {
    avatar: string,
    userName: string,
    userData: any[],
    userInfo: any[]
    changeAvatarWindow: boolean,
    newAvatar: string | undefined,
    editWindow: {
        isVisible: boolean
    }
}

class UserPage extends React.Component <{}, StateType> {
    fileInput: any;
    constructor(props: any) {
        super(props);
        this.fileInput = React.createRef();
        this.state = {
            avatar: "",
            userName: "",
            userData: [],
            userInfo: [],
            changeAvatarWindow: false,
            newAvatar: undefined,
            editWindow: {
                isVisible: false
            }
        };
    }

    async componentDidMount() {
        await this.updateUserData();
    }

    updateUserData = async() => {
        const myId = await getMyId();

        const resUserData = await fetch(`/api/users/get_user_data/${myId}`);
        const userData = await resUserData.json();

        const resUserInfo = await fetch(`/api/users/get_user_info/${myId}`);
        const userInfo = await resUserInfo.json();

        const resAvatar = await fetch(`/api/avatars/${userData.avatar}`);
        

        const data: any = [];

        for (let prop in userData) {
            if (!/^(name|email|avatar|status)$/.test(prop)) {
                data.push([prop, userData[prop]]);
            }
        }

        this.setState({ 
            userName: userData.name,
            avatar: resAvatar.url,
            userData: data,
            userInfo
        });
    }

    uploadAvatar = async (e: any) => {
        if (!this.state.newAvatar) {
            notify.warn("Выберите изображение");
            return;
        }

        const myId = await getMyId();

        const resUserData = await fetch(`/api/users/get_user_data/${myId}`);
        const userData = await resUserData.json();

        if (userData.avatar !== "default.png") {
            await this.deleteAvatar();
        }

        const files = new FormData();
        files.append("avatar", this.fileInput.current.files[0]);

        await fetch(`/api/users/set_avatar/${myId}`, {
            method: "POST",
            body: files
        });

        this.closeChangeAvatarWindow();
        this.updateUserData();
    }

    avatarHandler = () => {
        if (this.state.avatar === 'http://localhost:3000/api/avatars/default.png') {
            this.openChangeAvatarWindow();
        } else {
            window.open(this.state.avatar);
        }
    }

    deleteAvatar = async () => {
        const myId = await getMyId();
        
        await fetch(`/api/users/set_avatar/${myId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({
                avatar: null
            })
        });

        this.updateUserData();
    }

    selectImage = () => {
        const fileList = this.fileInput.current.files;

        this.setState({ 
            newAvatar: fileList.length ? fileList[0].name : undefined
        })
    }

    openChangeAvatarWindow = () => {
        this.setState({ changeAvatarWindow: true });
    }

    closeChangeAvatarWindow = () => {
        this.setState({ 
            changeAvatarWindow: false,
            newAvatar: ""
        });
    }

    setEditWindow = (value: boolean) => {
        this.setState({ editWindow: {
            isVisible: value
        } });
    }

    render() {
        return (
            <div className={styles.UserPage}>

                <div className={styles.left_column}>
                    <div className={styles.avatar}
                        onClick={this.avatarHandler}
                    >
                        {this.state.avatar && <img src={this.state.avatar} width="200" height="200" alt="*" />}
                    </div>
                </div>

                <div className={styles.right_column}>
                    <div className={styles.user_data}>
                        <div className={styles.header}>
                            <span>
                                {this.state.userName}
                            </span>

                            <DropdownContainer>
                                <IconButton size="small">
                                    <img src={iconEditGray} width={12} height={12} />
                                    <Tooltip placement="left">Редактировать</Tooltip>
                                </IconButton>
                                <DropdownMenu placement="right"
                                    arrow={{ right: 9 }}
                                >
                                    <DropdownItem onClick={this.openChangeAvatarWindow}>
                                        Сменить фото
                                    </DropdownItem>

                                    <DropdownItem onClick={this.deleteAvatar}>
                                        Удалить фото
                                    </DropdownItem>

                                    <DropdownItem onClick={() => this.setEditWindow(true)}>
                                        Основные данные
                                    </DropdownItem>

                                    <DropdownItem>
                                        Доп. данные
                                    </DropdownItem>

                                    <Divider space="medium" />

                                    <DropdownItem>
                                        Выход
                                    </DropdownItem>
                                </DropdownMenu>
                            </DropdownContainer>
                        </div>

                        <Divider />

                        <p className={styles.user_data_header}>Основная информация:</p>

                        <table className={styles.user_data_table}>
                            <tbody>
                                {this.state.userData.map((prop, index) => {
                                    return (
                                        <tr key={"usrdt" + index}>
                                            <td>{prop[0]}:</td>
                                            <td>{prop[1]}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>

                        <Divider />

                        <p className={styles.user_data_header}>Дополнительная информация:</p>
                        
                        <table className={styles.user_data_table}>
                            <tbody>
                                {this.state.userInfo.map((prop, index) => {
                                    return (
                                        <tr key={"usrnf" + index}>
                                            <td>{prop.type}:</td>
                                            <td>{prop.content}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>

                    </div>
                </div>

                <Backdrop blackout
                    isOpened={this.state.changeAvatarWindow}
                    onClose={this.closeChangeAvatarWindow}
                >
                    <ModalWindow>
                        <ModalHeader>Загрузить фото</ModalHeader>
                        <ModalBody>
                            <div>
                                    <input type="file" name="avatar" 
                                        ref={this.fileInput} 
                                        onChange={this.selectImage}
                                    />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={this.uploadAvatar}>Сохранить</Button>
                        </ModalFooter>
                    </ModalWindow>
                </Backdrop>

                <Backdrop blackout
                    isOpened={this.state.editWindow.isVisible}
                    onClose={() => this.setEditWindow(false)}
                >
                    <ModalWindow>
                        <ModalHeader>Редактировать</ModalHeader>
                        <ModalBody>
                            
                        </ModalBody>
                        <ModalFooter>
                            <Button>Сохранить</Button>
                        </ModalFooter>
                    </ModalWindow>
                </Backdrop>
                
            </div>
        );
    }
}

export default UserPage;

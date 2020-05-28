import React from 'react';
import styles from './Styles.m.css';

import {
    Backdrop,
    Button,
    Divider,
    InputField,
    Loading,
    LoadingError,
    ModalBody,
    ModalFooter,
    ModalWindow,
    Spoiller
} from '../../shared';

import { toast as notify } from 'react-toastify';

interface Props {
    isLoading: boolean,
    error: string,
    saveEmail: (email: string) => void,
    savePassword: (password: { oldPassword: string, newPassword: string }) => void
}

interface State {
    newEmail: string,
    changePassword: {
        oldPassword: string,
        newPassword: string
    },
    confirmDeleteWindow: boolean
}
  

class Settings extends React.Component<Props, State> {
    state = {
        newEmail: "",
        changePassword: {
            oldPassword: "",
            newPassword: ""
        },
        confirmDeleteWindow: false
    };

    saveNewEmail = () => {
        if (!this.state.newEmail) {
            notify.warn("Введите новый e-mail");
            return;
        }

        this.props.saveEmail(this.state.newEmail);
        this.setState({ newEmail: "" });
    }

    saveNewPassword = () => {
        if (!this.state.changePassword.oldPassword) {
            notify.warn("Введите ваш пароль");
            return;
        } else if (!this.state.changePassword.newPassword) {
            notify.warn("Введите новый пароль");
            return;
        }

        this.props.savePassword(this.state.changePassword);
        this.setState({ changePassword: {
            oldPassword: "",
            newPassword: ""
        } });
    }

    editEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ newEmail: e.target.value })
    }

    editPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            changePassword: {
                ...this.state.changePassword,
                [e.target.name]: e.target.value
            }
        })
    }

    clearChangingPassword = () => {
        this.setState({
            changePassword: {
                oldPassword: "", 
                newPassword: ""
            }
        })
    }

    deletePage = () => {
        
    }

    setConfirmDeleteWindow = (value: boolean) => {
        this.setState({ confirmDeleteWindow: value });
    }

    renderLoading = () => (
        <div className={styles.Settings}>
            <Loading />
        </div>
    );

    renderError = () => (
        <div className={styles.Settings}>
            <LoadingError error={this.props.error} />
        </div>
    );

    render() {
        if (this.props.error) {
            return this.renderError();
        } else if (this.props.isLoading) {
            return this.renderLoading();
        }

        return (
            <div className={styles.content}>
                <div className={styles.container}>
                    <Divider spaceY={8} bg="transparent" />

                    <Spoiller width={440} 
                        label="Изменить E-mail"
                        onHide={() => this.setState({ newEmail: "" })}
                    >
                        <InputField width={400}
                            label="Новый E-mail:"
                            value={this.state.newEmail}
                            onChange={this.editEmail}
                        />

                        <Divider spaceY={16} spaceX={12} />
                        <Button color="primary"
                            onClick={this.saveNewEmail}
                        >
                            Сохранить
                        </Button>
                        <Divider spaceY={4} bg="transparent" />
                    </Spoiller>

                    <Divider spaceY={8} bg="transparent" />

                    <Spoiller width={440} 
                        label="Изменить пароль"
                        onHide={this.clearChangingPassword}
                    >
                        <InputField width={400}
                            type="password"
                            label="Старый пароль:"
                            name="oldPassword"
                            value={this.state.changePassword.oldPassword}
                            onChange={this.editPassword}
                        />

                        <InputField width={400}
                            type="password"
                            label="Новый пароль:"
                            name='newPassword'
                            value={this.state.changePassword.newPassword}
                            onChange={this.editPassword}
                        />

                        <Divider spaceY={16} spaceX={12} />
                        <Button color="primary"
                            onClick={this.saveNewPassword}
                        >
                            Сохранить
                        </Button>
                        <Divider spaceY={4} bg="transparent" />
                    </Spoiller>

                    <Divider spaceY={16} />
                    <Button color="primary"
                        size="small"
                        onClick={() => this.setConfirmDeleteWindow(true)}
                    >
                        Удалить страницу
                    </Button>
                </div>

                <Backdrop blackout
                    isOpened={this.state.confirmDeleteWindow}
                    onClose={() => this.setConfirmDeleteWindow(false)}
                >
                    <ModalWindow isOpened={this.state.confirmDeleteWindow}>
                        <ModalBody align="left">
                            После того как страница будет удалена вы не сможете её восстановить. 
                            Вы уверены что хотите продолжить?
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary"
                                style={{ marginRight: 16 }}
                                onClick={() => this.setConfirmDeleteWindow(false)}
                            >
                                Отмена
                            </Button>

                            <Button color="primary"
                                onClick={this.deletePage}
                            >
                                Удалить
                            </Button>
                        </ModalFooter>
                    </ModalWindow>
                </Backdrop>

            </div>
        );
    }
}

export default Settings;

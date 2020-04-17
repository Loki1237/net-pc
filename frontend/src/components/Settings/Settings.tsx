import React from 'react';
import styles from './Styles.m.css';

import {
    Button,
    Divider,
    InputField,
    Radio,
    Spoiller,
    Label
} from '../../shared';

import { getMyId } from '../../middleware';
import { toast as notify } from 'react-toastify';

interface PropsType {
    
}

interface StateType {
    newEmail: string,
    oldPassword: string,
    newPassword: string
}
  

class Settings extends React.Component <PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            newEmail: "",
            oldPassword: "",
            newPassword: ""
        };
    }

    async componentDidMount() {
        
    }

    saveNewEmail = async () => {
        if (!this.state.newEmail) {
            notify.warn("Введите новый e-mail");
            return;
        }

        const myId = await getMyId();

        const res = await fetch(`/api/auth/change_email/${myId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charser=utf-8"
            },
            body: JSON.stringify({
                newEmail: this.state.newEmail
            })
        });

        if (res.status === 200) {
            notify.success("Новый e-mail успешно сохранён");
            this.setState({ newEmail: "" });
        } else {
            const resParse = await res.json();
            notify.error(resParse.error);
        }
    }

    saveNewPassword = async () => {
        if (!this.state.oldPassword) {
            notify.warn("Введите ваш пароль");
            return;
        } else if (!this.state.newPassword) {
            notify.warn("Введите новый пароль");
            return;
        }

        const myId = await getMyId();

        const res = await fetch(`/api/auth/change_password/${myId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charser=utf-8"
            },
            body: JSON.stringify({
                oldPassword: this.state.oldPassword,
                newPassword: this.state.newPassword
            })
        });

        if (res.status === 200) {
            notify.success("Новый пароль успешно сохранён");
            this.setState({ oldPassword: "", newPassword: "" });
        } else {
            const resParse = await res.json();
            notify.error(resParse.error);
        }
    }

    render() {
        return (
            <div className={styles.Settings}>
                <header>Настройки</header>

                <Divider spaceY={8} bg="transparent" />

                <Spoiller width={440} 
                    label="Изменить E-mail"
                    onHide={() => this.setState({ newEmail: "" })}
                >
                    <InputField width={400}
                        label="Новый E-mail:"
                        value={this.state.newEmail}
                        onChange={(e: any) => {
                            this.setState({ newEmail: e.target.value });
                        }}
                    />

                    <Divider spaceY={8} bg="transparent" />
                    <Button color="primary"
                        onClick={this.saveNewEmail}
                    >
                        Сохранить
                    </Button>
                </Spoiller>

                <Divider spaceY={8} bg="transparent" />

                <Spoiller width={440} 
                    label="Изменить пароль"
                    onHide={() => this.setState({ oldPassword: "", newPassword: "" })}
                >
                    <InputField width={400}
                        type="password"
                        label="Старый пароль:"
                        value={this.state.oldPassword}
                        onChange={(e: any) => {
                            this.setState({ oldPassword: e.target.value });
                        }}
                    />

                    <InputField width={400}
                        type="password"
                        label="Новый пароль:"
                        value={this.state.newPassword}
                        onChange={(e: any) => {
                            this.setState({ newPassword: e.target.value });
                        }}
                    />

                    <Divider spaceY={8} bg="transparent" />
                    <Button color="primary"
                        onClick={this.saveNewPassword}
                    >
                        Сохранить
                    </Button>
                </Spoiller>

            </div>
        );
    }
}

export default Settings;

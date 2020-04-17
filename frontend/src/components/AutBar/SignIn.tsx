import React from 'react';
import styles from './Styles.m.css';

import { history } from '../../middleware';
import { toast as notify } from 'react-toastify';

import Divider from '../../shared/Divider/Divider';
import InputField from '../../shared/InputField/InputField';
import Button from '../../shared/Button/Button';
import IconButton from '../../shared/IconButton/IconButton';

import iconLock from '../../shared/icons/icon_lock.png';

interface PropsType {

}

interface StateType {
    email: string,
    password: string,
}

class SignIn extends React.Component <PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            email: "",
            password: "",
        };
    }

    entry = async () => {
        if (!this.state.email || !this.state.password) {
            notify.warn("Введите ваш email и пароль");
            return;
        }
        
        const res = await fetch('/api/auth/login', { 
            method: "POST",
            headers: {
                "Content-Type": "application/json;charser=utf-8"
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        });
        
        if (res.status === 200) {
            history.push('/my-page');
        } else {
            notify.error("Неверно введён email или пароль");
        }
    }

    render() {
        return (
            <div className={styles.container}>
                <Divider spaceY={10} bg="transparent" />

                <InputField 
                    label="Эл. почта:"
                    value={this.state.email}
                    onChange={(e: any) => {
                        this.setState({ email: e.target.value });
                    }}
                />

                <InputField 
                    type="password"
                    label="Пароль:"
                    value={this.state.password}
                    onChange={(e: any) => {
                        this.setState({ password: e.target.value });
                    }}
                />

                <Divider spaceY={10} bg="transparent" />
                
                <div className={styles.row}>
                    <IconButton size="medium"
                        onClick={() => this.setState({ email: "loki1237@yandex.ru", password: "12345678" })}
                    >
                        <img src={iconLock} width={16} height={16} />
                    </IconButton>

                    <Button 
                        color="primary"
                        onClick={this.entry}
                        style={{ width: 260 }}
                    >
                        Войти
                    </Button>
                </div>
            </div>
        );
    }
}

export default SignIn;

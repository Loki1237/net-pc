import React from 'react';
import styles from './Styles.m.css';

import { history } from '../../middleware';
import { toast as notify } from 'react-toastify';

import {
    Button,
    Divider,
    Icon,
    IconButton,
    InputField
} from '../../shared';

interface Props {
    setUserId: Function
}

interface State {
    email: string,
    password: string,
}

class SignIn extends React.Component<Props, State> {
    state = {
        email: "",
        password: "",
    };

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
            const user = await res.json();
            this.props.setUserId(user.id);
            history.push(`/usr/${user.id}`);
        } else {
            notify.error("Неверно введён email или пароль");
        }
    }

    setEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ email: e.target.value });
    }

    setPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ password: e.target.value });
    }

    entryToDefaultProfile = () => {
        this.setState({ email: "loki1237@yandex.ru", password: "12345678" });
    }

    render() {
        return (
            <div className={styles.container}>
                <Divider spaceY={10} bg="transparent" />

                <InputField 
                    label="Эл. почта:"
                    value={this.state.email}
                    onChange={this.setEmail}
                />

                <InputField 
                    type="password"
                    label="Пароль:"
                    value={this.state.password}
                    onChange={this.setPassword}
                />

                <Divider spaceY={10} bg="transparent" />
                
                <div className={styles.row}>
                    <IconButton onClick={this.entryToDefaultProfile}>
                        <Icon img="lock" color="gray" />
                    </IconButton>

                    <Button color="primary"
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

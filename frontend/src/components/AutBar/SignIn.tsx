import React from 'react';
import styles from './Styles.m.css';
import { toast as notify } from 'react-toastify';

import {
    Button,
    Divider,
    Icon,
    IconButton,
    InputField
} from '../../shared';

interface Props {
    logInLoading: boolean,
    error: string,
    logIn: (email: string, password: string) => void
};

class SignIn extends React.Component<Props> {
    state = {
        email: "",
        password: "",
    };

    entry = async () => {
        if (!this.state.email || !this.state.password) {
            notify.warn("Введите ваш email и пароль");
            return;
        }

        this.props.logIn(this.state.email, this.state.password);
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

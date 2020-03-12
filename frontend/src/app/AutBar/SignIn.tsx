import React from 'react';
import history from '../history';
import styles from './AutBar.css';

import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import Switch from '../../components/Switch/Switch';
import SwitchItem from '../../components/Switch/SwitchItem';

import AppStateType from '../../types/AppStateType';

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
        if (this.state.email && this.state.password) {
            const res = await fetch('/api/users/login', { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charser=utf-8"
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password
                })
            });
            
            try {
                await res.json();
                //this.props.setNavBar(true);
                history.push('/my-page');
            } catch {
                console.log("Error: incorrect email or password");
            }
        }
    }

    render() {
        return (
            <div className={styles.container}>
                <InputField 
                    label="Эл. почта"
                    value={this.state.email}
                    onChange={(e: any) => {
                        this.setState({ email: e.target.value });
                    }}
                />

                <InputField 
                    type="password"
                    label="Пароль"
                    value={this.state.password}
                    onChange={(e: any) => {
                        this.setState({ password: e.target.value });
                    }}
                />

                <Button 
                    color="primary"
                    onClick={this.entry}
                    style={{
                        marginTop: 30,
                        width: 260
                    }}
                >
                    Войти
                </Button>

                <Button color="secondary"
                    style={{ marginTop: 30 }}
                    onClick={() => this.setState({ email: "loki1237@yandex.ru", password: "12345678" })}
                >
                    Заполнить
                </Button>
            </div>
        );
    }
}

export default SignIn;

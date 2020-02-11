import React from 'react';
import history from '../history';
import styles from './AutBar.css';

import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import Switch from '../../components/Switch/Switch';
import SwitchItem from '../../components/Switch/SwitchItem';

import AppStateType from '../../types/AppStateType';

interface PropsType {
    appState: AppStateType,
    setUserId: any
}

interface StateType {
    userIsAuthorized: undefined | boolean,
    mode: string,
    email: string,
    password: string,
    name: string,
    surname: string,
    birthday: string
}

class AutBar extends React.Component <PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            userIsAuthorized: undefined,
            mode: "login", // "login" | "sign-up"
            email: "",
            password: "",
            name: "",
            surname: "",
            birthday: ""
        };
    }

    async componentDidMount() {
        const res = await fetch('/api/users/login-as', { method: "POST" });

        if (res.status === 200) {
            history.push('/my-page');
        } else if (res.status === 401) {
            this.setState({ userIsAuthorized: false });
        }
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
                const user = await res.json();
                this.props.setUserId(user.id);
                history.push('/my-page');
            } catch {
                console.log("Error: incorrect email or password");
            }
        }
    }

    render() {
        if (this.state.userIsAuthorized === false) return (
            <div className={styles.AutBar}>

                <Switch>
                    <SwitchItem 
                        active={this.state.mode === "login"}
                        onClick={() => {
                            this.setState({ mode: "login" });
                        }}
                    >
                        Авторизация
                    </SwitchItem>

                    <SwitchItem 
                        active={this.state.mode === "sign-up"}
                        onClick={() => {
                            this.setState({ mode: "sign-up" });
                        }}
                    >
                        Регистрация
                    </SwitchItem>
                </Switch>

                {this.state.mode === "sign-up" && <InputField 
                    name="Имя"
                    value={this.state.name}
                    onChange={(e: any) => {
                        this.setState({ name: e.target.value });
                    }}
                />}

                {this.state.mode === "sign-up" && <InputField 
                    name="Фамилия"
                    value={this.state.surname}
                    onChange={(e: any) => {
                        this.setState({ surname: e.target.value });
                    }}
                />}

                {this.state.mode === "sign-up" && <InputField 
                    type="date"
                    name="Дата рождения"
                    style={{ textAlign: "center" }}
                    value={this.state.birthday}
                    onChange={(e: any) => {
                        this.setState({ birthday: e.target.value });
                    }}
                />}

                <InputField 
                    name="Эл. почта"
                    value={this.state.email}
                    onChange={(e: any) => {
                        this.setState({ email: e.target.value });
                    }}
                />

                <InputField 
                    type="password"
                    name="Пароль"
                    value={this.state.password}
                    onChange={(e: any) => {
                        this.setState({ password: e.target.value });
                    }}
                />

                {this.state.mode === "login" && <Button 
                    onClick={this.entry}
                    style={{
                        marginTop: 30,
                        width: 260
                    }}
                >
                    Войти
                </Button>}

                {this.state.mode === "sign-up" && <Button 
                    color="info"
                    onClick={() => {}}
                    style={{
                        marginTop: 30,
                        width: 260
                    }}
                >
                    Зарегестрироваться
                </Button>}
            </div>
        );
        
        return "";
    }
}

export default AutBar;

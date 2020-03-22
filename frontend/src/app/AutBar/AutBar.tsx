import React from 'react';
import { history } from '../middleware';
import styles from './Styles.m.css';

import SignIn from './SignIn';
import SignUp from './SignUp';

import Switch from '../../components/Switch/Switch';
import SwitchItem from '../../components/Switch/SwitchItem';

import AppStateType from '../../types/AppStateType';

interface PropsType {
    
}

interface StateType {
    userIsAuthorized: undefined | boolean,
    mode: string,
}

class AutBar extends React.Component <PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            userIsAuthorized: undefined,
            mode: "sign-in", // "sign-in" | "sign-up"
        };
    }

    async componentDidMount() {
        const res = await fetch('/api/users/login-as', { method: "POST" });

        if (res.status === 200) {
            history.push('/my-page');
        } else {
            this.setState({ userIsAuthorized: false });
        }
    }

    render() {
        if (this.state.userIsAuthorized === false) return (
            <div className={styles.AutBar}>

                <Switch>
                    <SwitchItem 
                        active={this.state.mode === "sign-in"}
                        onClick={() => {
                            this.setState({ mode: "sign-in" });
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

                {this.state.mode === "sign-in" && <SignIn />}

                {this.state.mode === "sign-up" && <SignUp />}
            </div>
        );
        
        return "";
    }
}

export default AutBar;

import React from 'react';
import { history } from '../../middleware';
import styles from './Styles.m.css';

import SignIn from './SignIn';
import SignUp from './SignUp';

import {
    Divider,
    Tabs,
    Tab
} from '../../shared';

interface Props {
    setUserId: Function
}

interface State {
    mode: string,
}

class AutBar extends React.Component<Props, State> {
    state = {
        mode: "sign-in", // "sign-in" | "sign-up"
    };

    async componentDidMount() {
        const res = await fetch('/api/users/login-as', { method: "POST" });

        if (res.status === 200) {
            history.push('/my-page');
        } 
    }

    render() {
        return (
            <div className={styles.AutBar}>

                <Tabs>
                    <Tab active={this.state.mode === "sign-in"}
                        onClick={() => this.setState({ mode: "sign-in" })}
                    >
                        Авторизация
                    </Tab>

                    <Tab active={this.state.mode === "sign-up"}
                        onClick={() => this.setState({ mode: "sign-up" })}
                    >
                        Регистрация
                    </Tab>
                </Tabs>
                <Divider />

                {this.state.mode === "sign-in" && <SignIn setUserId={this.props.setUserId} />}

                {this.state.mode === "sign-up" && <SignUp />}
            </div>
        );
    }
}

export default AutBar;

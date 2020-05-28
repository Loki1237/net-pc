import React from 'react';
import { history } from '../../middleware';
import styles from './Styles.m.css';

import SignIn from '../../containers/AutBar/SignIn';
import SignUp from '../../containers/AutBar/SignUp';

import { Tabs, Tab, Loading } from '../../shared';

interface Props {
    logInLoading: boolean,
    signUpLoading: boolean,
    urlParamMode: string
}

class AutBar extends React.Component<Props> {
    componentDidMount() {
        if (this.props.urlParamMode !== "sign-in" && this.props.urlParamMode !== "sign-up") {
            history.push('/auth/sign-in');
        }
    }

    render() {
        return (
            <div className={styles.AutBar}>
                <Tabs>
                    <Tab href="/auth/sign-in" active={this.props.urlParamMode === "sign-in"}>
                        {this.props.logInLoading ? <Loading size="small" /> : "Авторизация"}
                    </Tab>

                    <Tab href="/auth/sign-up" active={this.props.urlParamMode === "sign-up"}>
                        {this.props.signUpLoading ? <Loading size="small" /> : "Регистрация"}
                    </Tab>
                </Tabs>

                {this.props.urlParamMode === "sign-in" && <SignIn />}
                {this.props.urlParamMode === "sign-up" && <SignUp />}
            </div>
        );
    }
}

export default AutBar;

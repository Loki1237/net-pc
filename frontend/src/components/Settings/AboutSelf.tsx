import React from 'react';
import styles from './Styles.m.css';

import {
    Button,
    Divider,
    TextArea 
} from '../../shared';

import { toast as notify } from 'react-toastify';
import { getMyId } from '../../middleware';

interface PropsType {
    
}

interface StateType {
    activity: string,
    interests: string,
    hobby: string,
    aboutSelf: string
}
  

class AboutSelf extends React.Component <PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            activity: "",
            interests: "",
            hobby: "",
            aboutSelf: ""
        };
    }

    async componentDidMount() {
        const myId = await getMyId();
        const resUserData = await fetch(`/api/users/get_user_data/${myId}`);
        const userData = await resUserData.json();

        this.setState({
            activity: userData.activity,
            interests: userData.interests,
            hobby: userData.hobby,
            aboutSelf: userData.about_self
        });
    }

    saveAboutSelfInfo = async () => {
        const myId = await getMyId();

        const res = await fetch(`/api/users/change_about_self_info/${myId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charser=utf-8"
            },
            body: JSON.stringify({
                activity: this.state.activity,
                interests: this.state.interests,
                hobby: this.state.hobby,
                aboutSelf: this.state.aboutSelf
            })
        });

        if (res.status === 200) {
            notify.success("Данные сохранены");
        } else {
            const resParse = await res.json();
            notify.error(resParse.error);
        }
    }

    render() {
        return (
            <div className={styles.Settings}>
                <header>О себе</header>

                <TextArea minRows={5} maxRows={10}
                    width={400}
                    label="Деятельность"
                    value={this.state.activity}
                    onChange={(e: any) => this.setState({ activity: e.target.value })}
                />

                <TextArea minRows={5} maxRows={10}
                    width={400}
                    label="Интересы"
                    value={this.state.interests}
                    onChange={(e: any) => this.setState({ interests: e.target.value })}
                />

                <TextArea minRows={5} maxRows={10}
                    width={400}
                    label="Хобби"
                    value={this.state.hobby}
                    onChange={(e: any) => this.setState({ hobby: e.target.value })}
                />

                <TextArea minRows={5} maxRows={10}
                    width={400}
                    label="О себе"
                    value={this.state.aboutSelf}
                    onChange={(e: any) => this.setState({ aboutSelf: e.target.value })}
                />

                <Divider spaceY={12} />

                <Button color="primary"
                    onClick={this.saveAboutSelfInfo}
                >
                    Сохранить
                </Button>
            </div>
        );
    }
}

export default AboutSelf;

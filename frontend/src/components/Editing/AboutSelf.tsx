import React from 'react';
import styles from './Styles.m.css';

import {
    Button,
    Divider,
    TextArea 
} from '../../shared';

import { toast as notify } from 'react-toastify';

interface Props {
    userId: number
}

interface State {
    aboutSelfData: {
        activity: string,
        interests: string,
        hobby: string,
        aboutSelf: string
    }
}
  

class AboutSelf extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            aboutSelfData: {
                activity: "",
                interests: "",
                hobby: "",
                aboutSelf: ""
            }
        };
    }

    async componentDidMount() {
        await this.updateData();
    }

    updateData = async () => {
        const resUserData = await fetch(`/api/users/get_user_data/${this.props.userId}`);
        const userData = await resUserData.json();

        this.setState({
            aboutSelfData: {
                activity: userData.activity,
                interests: userData.interests,
                hobby: userData.hobby,
                aboutSelf: userData.about_self
            }
        });
    }

    saveAboutSelfInfo = async () => {
       const res = await fetch(`/api/users/change_about_self_info/${this.props.userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charser=utf-8"
            },
            body: JSON.stringify(this.state.aboutSelfData)
        });

        if (res.status === 200) {
            notify.success("Данные сохранены");
        } else {
            const resParse = await res.json();
            notify.error(resParse.error);
        }
    }

    editField = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ 
            aboutSelfData: {
                ...this.state.aboutSelfData,
                [e.target.name]: e.target.value
            } 
        });
    }

    render() {
        return (
            <div className={styles.Settings}>
                <header>О себе</header>

                <TextArea minRows={5} maxRows={10}
                    width={400}
                    label="Деятельность"
                    name="activity"
                    value={this.state.aboutSelfData.activity}
                    onChange={this.editField}
                />

                <TextArea minRows={5} maxRows={10}
                    width={400}
                    label="Интересы"
                    name="interests"
                    value={this.state.aboutSelfData.interests}
                    onChange={this.editField}
                />

                <TextArea minRows={5} maxRows={10}
                    width={400}
                    label="Хобби"
                    name="hobby"
                    value={this.state.aboutSelfData.hobby}
                    onChange={this.editField}
                />

                <TextArea minRows={5} maxRows={10}
                    width={400}
                    label="О себе"
                    name="aboutSelf"
                    value={this.state.aboutSelfData.aboutSelf}
                    onChange={this.editField}
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

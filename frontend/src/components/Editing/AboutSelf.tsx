import React from 'react';
import styles from './Styles.m.css';

import { Button, TextArea, Loading, LoadingError } from '../../shared';
import { AboutSelfType } from '../../store/Editing/types';

interface Props {
    isLoading: boolean,
    error: string,
    aboutSelf: AboutSelfType,
    getUserData: () => void,
    edit: (fieldName: string, value: string) => void,
    save: (data: AboutSelfType) => void,
    resetState: () => void
}

class AboutSelf extends React.Component<Props> {
    componentDidMount() {
        this.props.getUserData();
    }

    componentWillUnmount() {
        this.props.resetState();
    }

    save = async () => {
       this.props.save(this.props.aboutSelf);
    }

    edit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.props.edit(e.target.name, e.target.value);
    }

    renderLoading = () => (
        <div className={styles.Settings}>
            <Loading />
        </div>
    );

    renderError = () => (
        <div className={styles.Settings}>
            <LoadingError error={this.props.error} />
        </div>
    );

    render() {
        if (this.props.error) {
            return this.renderError();
        } else if (this.props.isLoading) {
            return this.renderLoading();
        }

        return (
            <div className={styles.content}>
                <div className={styles.container}>
                    <TextArea minRows={5} maxRows={10}
                        width={400}
                        label="Деятельность"
                        name="activity"
                        value={this.props.aboutSelf.activity}
                        onChange={this.edit}
                    />

                    <TextArea minRows={5} maxRows={10}
                        width={400}
                        label="Интересы"
                        name="interests"
                        value={this.props.aboutSelf.interests}
                        onChange={this.edit}
                    />

                    <TextArea minRows={5} maxRows={10}
                        width={400}
                        label="Хобби"
                        name="hobby"
                        value={this.props.aboutSelf.hobby}
                        onChange={this.edit}
                    />

                    <TextArea minRows={5} maxRows={10}
                        width={400}
                        label="О себе"
                        name="aboutSelf"
                        value={this.props.aboutSelf.aboutSelf}
                        onChange={this.edit}
                    />
                </div>

                <div className={styles.footer}>
                    <Button color="primary"
                        onClick={this.save}
                    >
                        Сохранить
                    </Button>
                </div>
            </div>
        );
    }
}

export default AboutSelf;

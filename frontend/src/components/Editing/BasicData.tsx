import React from 'react';
import styles from './Styles.m.css';

import {
    DatePicker,
    Icon,
    InputField,
    Loading,
    LoadingError,
    Option,
    Select,
    Backdrop,
    Button,
    IconButton
} from '../../shared';

import { BasicDataType } from '../../store/Editing/types';

interface Props {
    isLoading: boolean,
    error: string,
    basicData: BasicDataType,
    getUserData: () => void,
    edit: (fieldName: string, value: string) => void,
    save: (data: BasicDataType) => void,
    resetState: () => void
}

class BasicData extends React.Component<Props> {
    state = {
        DatePicker: false
    };

    componentDidMount() {
        this.props.getUserData();
    }

    componentWillUnmount() {
        this.props.resetState();
    }

    setDatePicker = (value: boolean) => {
        this.setState({ DatePicker: value });
    }

    edit = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.edit(e.target.name, e.target.value);
    }

    editDate = (date: string) => {
        this.props.edit("birthday", date);
    }

    changeFamilyStatus = (value: string) => {
        this.props.edit("familyStatus", value);
    }

    save = async () => {
        this.props.save(this.props.basicData);
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
                    <InputField 
                        label="Имя:"
                        name="firstName"
                        value={this.props.basicData.firstName}
                        onChange={this.edit}
                    />

                    <InputField 
                        label="Фамилия:"
                        name="lastName"
                        value={this.props.basicData.lastName}
                        onChange={this.edit}
                    />

                    <InputField 
                        label="Дата рождения:"
                        name="birthday"
                        value={this.props.basicData.birthday}
                        readOnly
                        icon={
                            <IconButton size="medium"
                                onClick={() => this.setDatePicker(true)}
                            >
                                <Icon img="calendar" color="gray" />
                            </IconButton>
                        }
                    />

                    <Select label="Семейное положение:" 
                        value={this.props.basicData.familyStatus} 
                        onChange={this.changeFamilyStatus}
                    >
                        <Option value="not_selected">Не выбрано</Option>
                        <Option value="married">В браке</Option>
                        <Option value="free">Свободен/на</Option>
                        <Option value="has_partner">Встречаюсь</Option>
                        <Option value="want_meet">Познакомлюсь</Option>
                    </Select>

                    <InputField 
                        label="Страна:"
                        name="country"
                        value={this.props.basicData.country}
                        onChange={this.edit}
                    />

                    <InputField 
                        label="Город:"
                        name="city"
                        value={this.props.basicData.city}
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

                <Backdrop blackout
                    isOpened={this.state.DatePicker}
                    onClose={() => this.setDatePicker(false)}
                >
                    <DatePicker
                        isOpened={this.state.DatePicker}
                        minYear={1900}
                        maxYear={2100}
                        value={this.props.basicData.birthday}
                        onChange={this.editDate}
                        onClose={() => this.setDatePicker(false)}
                    />
                </Backdrop>
            </div>
        );
    }
}

export default BasicData;

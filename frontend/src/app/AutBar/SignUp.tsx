import React from 'react';
import history from '../history';
import styles from './AutBar.css';

import Select from '../../components/Select/Select';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';

import AppStateType from '../../types/AppStateType';

interface PropsType {
     
}

interface StateType {
    email: string,
    password: string,
    name: string,
    surname: string,
    gender: string,
    birthday: string
}

class SignUp extends React.Component <PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            email: "",
            password: "",
            name: "",
            surname: "",
            gender: "",
            birthday: ""
        };
    }

    render() {
        return (
            <div className={styles.container}>
                <InputField 
                    label="Имя"
                    value={this.state.name}
                    onChange={(e: any) => {
                        this.setState({ name: e.target.value });
                    }}
                />

                <InputField 
                    label="Фамилия"
                    value={this.state.surname}
                    onChange={(e: any) => {
                        this.setState({ surname: e.target.value });
                    }}
                />

                <Select label="Пол"
                    value={this.state.gender}
                    onChange={(gender: string) => {
                        this.setState({ gender });
                    }}
                    options={[
                        { label: "Мужской", value: "male"},
                        { label: "Женский", value: "female"}
                    ]}
                />

                <InputField 
                    type="date"
                    label="Дата рождения"
                    style={{ textAlign: "center" }}
                    value={this.state.birthday}
                    onChange={(e: any) => {
                        this.setState({ birthday: e.target.value });
                    }}
                />

                <Button color="info"
                    style={{ marginTop: 30 }}
                >
                    Далее
                </Button>
            </div>
        );
    }
}

export default SignUp;
